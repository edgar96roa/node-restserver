const { Router } = require('express');
const { check } = require('express-validator');

const { validateJWT, validateFields, isAdminRole } = require('../middlewares');

const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, eliminarProducto } = require('../controllers/productos');

const { existsCategoria, existsProducto } = require('../helpers/db-validators');

const router = Router();

/**
 * {{url}}/api/productos
 */

//Obtener todas las categorias
router.get('/', obtenerProductos);

//Obtener una categoria por id - publico
router.get('/:id', [
    check('id').custom( existsProducto ),
    check('id', 'No es un Id válido').isMongoId(),
    validateFields
], obtenerProducto);

//Crear una categoria - privado - cualquier persona con un token válido
router.post('/', [
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de Mongo').isMongoId(), //se valida que haya id de categoria
    check('id').custom( existsCategoria ), //se valida que exista la categoria
    validateFields
], crearProducto);

//Actualizar una categoria por id - privado - cualquier persona con un token válido
router.put('/:id', [
    validateJWT,
    check('id').custom( existsProducto ),
    // check('categoria').optional().custom( existsCategoria ),
    validateFields
], actualizarProducto);

//Eliminar una categoria por id - ADMIN
router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'No es un Id válido').isMongoId(),
    check('id').custom( existsProducto ),
    validateFields
], eliminarProducto );

module.exports = router;