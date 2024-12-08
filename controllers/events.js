const { request, response } = require("express");
const Evento = require('../models/Event')

const getEvents = async( req = request, res = response ) => {
    const eventos = await Evento.find().populate('user', 'name');
    return res.json({
        ok: true,
        eventos
    });
}

const createEvent = async( req = request, res = response ) => {
    const evento = new Evento( req.body );
    try {
        evento.user = req.uid;
        const eventoGuardado = await evento.save();
        
        return res.status( 201 ).json({
            ok: true,
            evento: eventoGuardado
        })
    } catch (error) {
        console.log( error );
        return res.status( 500 ).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const updateEvent = async( req = request, res = response ) => {
    const eventoID = req.params.id;
    const uid = req.uid;
    try {
        const evento = await Evento.findById( eventoID );
        
        if( !evento ){
            return res.status( 404 ).json({
                ok: false,
                msg: 'Evento no existe por ese id'
            });
        }

        if( evento.user.toString() !== uid ){
            return res.status( 401 ).json({
                ok: false,
                msg: 'No tiene privilegio de editar este evento'
            });
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate( eventoID, nuevoEvento, {
            new: true
        } );

        return res.json({
            ok: true,
            evento: eventoActualizado
        });

    } catch (error) {
        console.log( error );
        return res.status( 500 ).json({
            ok: true,
            msg: 'Hable con el administrador'
        });
    }
    
}

const deleteEvent = async( req = request, res = response ) => {
    const eventoID = req.params.id;
    const uid = req.uid;
    try {
        const evento = await Evento.findById( eventoID );
        
        if( !evento ){
            return res.status( 404 ).json({
                ok: false,
                msg: 'Evento no existe por ese id'
            });
        }

        if( evento.user.toString() !== uid ){
            return res.status( 401 ).json({
                ok: false,
                msg: 'No tiene privilegio de eliminar este evento'
            });
        }

        await Evento.findByIdAndDelete( eventoID );

        return res.json({
            ok: true,
            msg: 'Evento eliminado con éxito.'
        });

    } catch (error) {
        console.log( error );
        return res.status( 500 ).json({
            ok: true,
            msg: 'Hable con el administrador'
        })    
    }
    return res.json({
        ok: true,
        msg: 'deleteEvent'
    })
}

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,
}