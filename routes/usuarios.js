const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields } = require('../middlewares/validateFields');
const { esRoleValido, existsEmail, existsUserById } = require('../helpers/db-validators');

const { usuariosGet, 
        usuariosPost, 
        usuariosPut, 
        usuariosDelete } = require('../controllers/usuarios');

const router = Router();

router.get('/', usuariosGet);

router.post('/', [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email no es válido').isEmail(),
        check('password', 'El password es obligatorio con 4 caracteres mínimo y 10 máximo').notEmpty().isLength({ min:4, max:10 }),
        //check('role', 'No es un rol permitido').isIn(['ADMIN_ROLE','USER_ROLE']),
        check('email').custom( existsEmail ),
        check('role').custom( esRoleValido ),
        validateFields
],usuariosPost);

router.put('/:id', [
        check('id', 'No es un Id válido').isMongoId(),
        check('id').custom( existsUserById ),
        check('role').custom( esRoleValido ),
        validateFields
], usuariosPut);

router.delete('/:id', [
        check('id', 'No es un Id válido').isMongoId(),
        check('id').custom( existsUserById ),
        validateFields
], usuariosDelete);

module.exports = router;