const { Router } = require('express');
const { check } = require('express-validator');

const { validateJWT, validateFields, isAdminRole } = require('../middlewares');

const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, eliminarCategoria } = require('../controllers/categorias');
const { existsCategoria } = require('../helpers/db-validators');

const router = Router();

/**
 * {{url}}/api/categorias
 */

//Obtener todas las categorias
router.get('/', obtenerCategorias);

//Obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'No es un Id válido').isMongoId(),
    check('id').custom( existsCategoria ),
    validateFields
], obtenerCategoria);

//Crear una categoria - privado - cualquier persona con un token válido
router.post('/', [
    validateJWT,
    check('name', 'El nombre es obligatorio').notEmpty(),
    validateFields
], crearCategoria);

//Actualizar una categoria por id - privado - cualquier persona con un token válido
router.put('/:id', [
    validateJWT,
    check('name', 'El nombre es obligatorio').notEmpty(),
    check('id').custom( existsCategoria ),
    validateFields
], actualizarCategoria);

//Eliminar una categoria por id - ADMIN
router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'No es un Id válido').isMongoId(),
    check('id').custom( existsCategoria ),
    validateFields
], eliminarCategoria );

module.exports = router;