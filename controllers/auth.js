const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generateJWT } = require('../helpers/generateJWT');


const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        //Verificar si el email existe
        const usuario = await Usuario.findOne({ email });

        if( !usuario ) {
            return res.status(400).json({
                msg: 'Email incorrecto'
            });
        }

        //Verificar si el usuario está activo
        if( !usuario.state ) {
            return res.status(400).json({
                msg: 'Estado: false'
            });
        }

        //Verificar password
        const rightPassword = bcryptjs.compareSync( password, usuario.password );
        if( !rightPassword ){
            return res.status(400).json({
                msg: 'Password incorrecto'
            })
        }

        //Generar JWT
        const token = await generateJWT( usuario.id );

        res.json({
            usuario,
            token
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}

module.exports = {
    login
}