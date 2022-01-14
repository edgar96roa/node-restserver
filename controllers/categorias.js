const { response } = require('express');
const { Categoria } = require('../models')

// obtenerCategorias - paginado - total - populate
const obtenerCategorias = async( req = request, res = response ) => {
    
    const { limite = 5, desde = 0 } = req.query;

    const query = { state: true };
    
    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario', 'name') //concatena el name al uid del usuario
            .skip(parseInt(desde))
            .limit(parseInt(limite))
    ]);

    res.json({
        total,
        categorias
    });
}

// obtenerCategoria - populate
const obtenerCategoria = async( req = request, res = response ) => {
    
    const { id } = req.params;
    
    const categoria = await Categoria.findById(id)
                                    .populate('usuario', 'name') //concatena el name al uid del usuario;

    res.status(200).json({
        categoria
    });
}

const crearCategoria = async( req, res = response ) => {
    
    const name = req.body.name.toUpperCase();

    const categoriaDB = await Categoria.findOne({ name });

    if( categoriaDB ) {
        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.name } ya existe`
        });
    }

    //Generar la data a guardar
    const data = {
        name,
        usuario: req.usuario._id
    }

    const categoria = new Categoria( data );

    //Guardar DB
    await categoria.save();

    res.status(201).json(categoria);
}

// actualizarCategoria
const actualizarCategoria = async( req = request, res = response) => {

    const { id } = req.params;
    const { state, usuario, ...data } = req.body;

    data.name = data.name.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

    res.json( categoria );

}

// borrarCategoria
const eliminarCategoria = async( req = request, res = response) => {
    
    const { id } = req.params;
    const categoriaBorrada = await Categoria.findByIdAndUpdate( id, { state: false }, { new: true} );

    res.json( categoriaBorrada );

}

module.exports = {
    actualizarCategoria,
    crearCategoria,
    eliminarCategoria,
    obtenerCategoria,
    obtenerCategorias
}