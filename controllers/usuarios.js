const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const usuariosGet = async( req = request, res = response ) => {

    // const { q, nombre = 'No name', apikey, page = 1, limit } = req.query;
    const { limite = 5, desde = 0 } = req.query;

    const query = { state: true };
    
    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(parseInt(desde))
            .limit(parseInt(limite))
    ]);

    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async(req, res = response) => {

    const { name, email, password, role } = req.body;
    const usuario = new Usuario( { name, email, password, role } );//proviene del modelo

    //encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    //Guardar en BD
    await usuario.save();

    res.status(201).json({
        msg: 'post API - controlador',
        usuario
    });
}

const usuariosPut = async(req, res) => {

    const id = req.params.id;

    const { _id, password, google, email, ...resto } =req.body;
    
    //TODO validar vs bdd
    if( password ){

        //encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );

    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.json({
        usuario
    });
}

const usuariosDelete = async(req, res) => {

    const { id } = req.params;

    //Borrado físico
    //const usuario = await Usuario.findByIdAndDelete( id );
    const usuario = await Usuario.findByIdAndUpdate( id, { state: false });

    res.json( usuario );
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete
}