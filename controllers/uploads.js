const { response } = require('express');
const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL );

const { uploadFile } = require('../helpers/upload-file');

const { Usuario, Producto } = require('../models');

const cargarArchivo = async(req, res = response) => {

    try {
        const pathCompleto = await uploadFile( req.files, ['txt', 'md'], 'textos' );

        res.json({
            name: pathCompleto
        });
    } catch(msg) {
        res.status(400).json({ msg });
    }

}

const actualizarImagen = async(req, res = response) => {

    const {id, coleccion} = req.params;
    
    let model;

    switch ( coleccion ) {
        case 'usuarios':
            model = await Usuario.findById(id);
            if( !model ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
            
        break;
    
        case 'productos':
            model = await Producto.findById(id);
            if( !model ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }
        break;

        default:
            return res.status(500).json({ msg: 'Error interno del servidor' });
    }

    //limpiar imagenes previas
    try {
        if( model.image ) {
            //borrar imagen del server
            const imagePath = path.join( __dirname, '../uploads', coleccion, model.image );

            if( fs.existsSync( imagePath ) ){
                fs.unlinkSync( imagePath );
            }
        }
    } catch (error) {
        
    }

    model.image = await uploadFile( req.files, undefined, coleccion );

    await model.save();

    res.json( model );
}

const actualizarImagenCloudinary = async(req, res = response) => {

    const {id, coleccion} = req.params;
    
    let model;

    switch ( coleccion ) {
        case 'usuarios':
            model = await Usuario.findById(id);
            if( !model ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
            
        break;
    
        case 'productos':
            model = await Producto.findById(id);
            if( !model ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }
        break;

        default:
            return res.status(500).json({ msg: 'Error interno del servidor' });
    }

    //limpiar imagenes previas

    if( model.image ) {
        //borrar imagen del server
        const nombreArr = model.image.split('/');
        const nombre = nombreArr[ nombreArr.length - 1 ];
        const [ public_id ] = nombre.split('.');
        cloudinary.uploader.destroy( public_id );
    }
    //subir nueva imagen
    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );

    model.image = secure_url;        
    await model.save();
    res.json( model );
    
}

const mostrarImagen = async(req, res = response) => {

    const {id, coleccion} = req.params;
    let model;

    switch ( coleccion ) {
        case 'usuarios':
            model = await Usuario.findById(id);
            if( !model ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
        break;
    
        case 'productos':
            model = await Producto.findById(id);
            if( !model ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }
        break;

        default:
            return res.status(500).json({ msg: 'Error interno del servidor' });
    }
    //limpiar imagenes previas
    try {
        if( model.image ) {
            //borrar imagen del server
            const imagePath = path.join( __dirname, '../uploads', coleccion, model.image );
            if( fs.existsSync( imagePath ) ){
                res.sendFile( imagePath );
            }
        } else {
            const imagePath = path.join( __dirname, '../assets/no-image.jpg' );
            res.sendFile( imagePath );
        }
    } catch (error) {
        throw new Error(`Error: ${ error }`);
    }

}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    actualizarImagenCloudinary,
    mostrarImagen
}