const { request, response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async( req = request, res = response ) => {
    const { name, email, password } = req.body;
    try {
        let usuario = await Usuario.findOne( { email } );
        if( usuario ){
            return res.status( 400 ).json({
                ok: false,
                msg: 'El usuario ya existe en la base de datos'
            });
        }
        usuario = new Usuario( { name, email, password } );

        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        await usuario.save();

        // TODO: generar JWT
        const token = await generarJWT( usuario.id, usuario.name );

        res.status(201).json({
            ok: true,
            msg: '',
            uid: usuario.id,
            name: usuario.name,
            token
        });

    } catch (error) {
        console.log( error );
        res.status( 500 ).json({
            ok: false,
            msg:'Por favor hable con el administrador'
        });
    }
    
}

const loginUsuario = async( req = request, res = response ) => {
    const { email, password } = req.body;
        
    try {
        const usuario = await Usuario.findOne( { email } );
        if( !usuario ){
            return res.status( 400 ).json({
                ok: false,
                msg: 'Credenciales incorrectas - email'
            });
        }

        const isPasswordValid = bcrypt.compareSync( password, usuario.password );
        if( !isPasswordValid ){
            return res.status( 400 ).json({
                ok: false,
                msg: 'Credenciales incorrectas - pswd'
            })
        }

        // TODO: generar JWT
        const token = await generarJWT( usuario.id, usuario.name );

        return res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })
    } catch (error) {
        console.log( error );
        res.status( 500 ).json({
            ok: false,
            msg:'Por favor hable con el administrador'
        });
    }
}

const renewToken = async( req = request, res = response ) => {
    const uid = req.uid;
    const name = req.name;
    
    const token = await generarJWT( uid, name );

    res.json({
        ok: true,
        msg: 'renew',
        uid,
        name,
        token
    })
}


module.exports = {
    crearUsuario,
    loginUsuario,
    renewToken
}