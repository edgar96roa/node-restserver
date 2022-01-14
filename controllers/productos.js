const { response } = require('express');
const { Producto } = require('../models')

// obtenerProductos - paginado - total - populate
const obtenerProductos = async( req = request, res = response ) => {
    
    const { limite = 5, desde = 0 } = req.query;

    const query = { state: true };
    
    const [ total, productos ] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'name') //concatena el name al uid del usuario
            .skip(parseInt(desde))
            .limit(parseInt(limite))
    ]);

    res.json({
        total,
        productos
    });
}

// obtenerProducto - populate
const obtenerProducto = async( req = request, res = response ) => {

    const { id } = req.params;
    
    const producto = await Producto.findById(id)
                                    .populate('usuario', 'name')
                                    .populate('categoria', 'name').exec();

    res.status(200).json({
        producto
    });

}

const crearProducto = async( req, res = response ) => {
    
    const { state, usuario, ...body } = req.body;

    const productoDB = await Producto.findOne({ name: body.name });

    if( productoDB ) {
        return res.status(400).json({
            msg: `La categoria ${ productoDB.name } ya existe`
        });
    }

    //Generar la data a guardar
    const data = {
        ...body,
        name: body.name.toUpperCase(),
        usuario: req.usuario._id
    }

    const producto = new Producto( data );

    //Guardar DB
    await producto.save();

    res.status(201).json(producto);
}

// actualizarCategoria
const actualizarProducto = async( req = request, res = response) => {

    const { id } = req.params;
    const { state, usuario, ...data } = req.body;

    if( data.name ) {
        data.name = data.name.toUpperCase();
    }

    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

    res.json( producto );

}

// borrarCategoria
const eliminarProducto = async( req = request, res = response) => {
    
    const { id } = req.params;

    const data = await Producto.findByIdAndUpdate( id, { state: false }, { new: true} );

    res.json( data );

}

module.exports = {
    actualizarProducto,
    crearProducto,
    eliminarProducto,
    obtenerProducto,
    obtenerProductos
}