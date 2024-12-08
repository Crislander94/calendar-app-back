/*
    Rutas de usuarios
    host + /api/auth
*/

const { Router } = require('express');
const { crearUsuario, renewToken, loginUsuario } = require('../controllers/auth');
const router = Router();
const { check } = require('express-validator');
const validarCampos = require('../middlewares/validarCampos');
const { validarJWT } = require('../middlewares/validarJWT');

router.post( '/new',[
    check('name', 'El campo es obligatorio').not().isEmpty(),
    check('email', 'Debe enviar un email válido').isEmail(),
    check('password', 'Debe enviar un password de al menos 6 caracteres').isLength({ min: 6 }),
    validarCampos
],crearUsuario );

router.post( '/',[
    check('email', 'Debe enviar un email válido').isEmail(),
    check('password', 'Debe enviar un password de al menos 6 caracteres').isLength({ min: 6 }),
    validarCampos
],loginUsuario );

router.get( '/renew', validarJWT ,renewToken );

module.exports = router;