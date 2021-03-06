const { response } = require('express');
const { ObjectId } = require('mongoose').Types;

const { Categoria, Producto, Usuario } = require('../models')

const coleccionesPermitidas = [
    'categorias',
    'productos',
    'roles',
    'usuarios'
];

const buscarUsuarios = async( termino = '', res = response) => {
    
    const esMongoId = ObjectId.isValid( termino ); //true

    if( esMongoId ) {
        const usuario = await Usuario.findById(termino).exec();
        return res.json({
            results: ( usuario ) ? [ usuario ] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    const usuarios = await Usuario.find({ 
        $or: [{ name: regex} , { email: regex}],
        $and: [{ state: true }]
    }).exec();

    res.json({
        results: usuarios
    });

}

const buscarCategorias = async( termino = '', res = response) => {
    
    const esMongoId = ObjectId.isValid( termino ); //true

    if( esMongoId ) {
        const categoria = await Categoria.findById(termino).exec();
        return res.json({
            results: ( categoria ) ? [ categoria ] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    const categorias = await Categoria.find({ name: regex, state: true }).exec();

    res.json({
        results: categorias
    });

}

const buscarProductos = async( termino = '', res = response) => {
    
    const esMongoId = ObjectId.isValid( termino ); //true

    if( esMongoId ) {
        const producto = await Producto.findById(termino)
                                        .populate('categoria','name').exec();
        return res.json({
            results: ( producto ) ? [ producto ] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    const productos = await Producto.find({ name: regex, state: true })
                                        .populate('categoria','name').exec();

    res.json({
        results: productos
    });

}

const buscar = ( req, res = response ) => {

    const { coleccion, termino } = req.params;

    if( !coleccionesPermitidas.includes(coleccion) ) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${ coleccionesPermitidas }`
        });
    }

    switch (coleccion) {
        case 'categorias':
            buscarCategorias(termino, res);
        break;

        case 'productos':
            buscarProductos(termino, res);
        break;

        case 'usuarios':
            buscarUsuarios(termino, res);
        break;

        default:
            res.status(500).json({
                msg: 'La b??squeda est?? presentando problemas'
            });
    }
}

module.exports = {
    buscar
}
