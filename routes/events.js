const { Router } = require('express');
const { validarJWT } = require('../middlewares/validarJWT');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/events');
const { check } = require('express-validator');
const validarCampos = require('../middlewares/validarCampos');
const { isDate } = require('../helpers/isDate');
const router = Router();

router.use(  validarJWT );

router.get('/', getEvents );
router.post('/',[
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start', 'La fecha de inicio es obligatoria | o no es válida' ).custom(  isDate ),
    check('end', 'La fecha final es obligatoria | o no es válida' ).custom(  isDate ),
    validarCampos
],createEvent );
router.put('/:id',[
    check('id', 'No es un id de Mongo').isMongoId(),
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start', 'La fecha de inicio es obligatoria | o no es válida' ).custom(  isDate ),
    check('end', 'La fecha final es obligatoria | o no es válida' ).custom(  isDate ),
    validarCampos
], updateEvent );
router.delete('/:id',[
    check('id', 'No es un id de Mongo').isMongoId(),
    validarCampos
], deleteEvent );


module.exports = router;