const { response, request } = require("express");
const jwt = require('jsonwebtoken');

const validarJWT = ( req = request, res = response, next ) => {
    const token = req.header('x-token');

    if( !token ){
        return res.status( 401 ).json({
            ok: false,
            msg: 'El token enviado no es válido'
        })
    }

    try {
        const { uid, name } = jwt.verify(
            token,
            process.env.SECRET_JWT_SEED
        )

        req.uid = uid;
        req.name = name;

    } catch (error) {
        console.log( error );
        return res.status(400).json({
            ok: false,
            msg: 'Ocurrió un error al validar la autenticación'
        })
    }
    
    next();
}

module.exports = {
    validarJWT
}