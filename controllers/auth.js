const { response, request, json } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generateJWT } = require('../helpers/generateJWT');
const { googleVerify } = require('../helpers/google-verify');
const usuario = require('../models/usuario');


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

const googleSignIn = async( req, res = response ) => {
    const { id_token } = req.body;

    try {
        const googleUser = await googleVerify( id_token );

        const { name, image, email } = googleUser;
        
        let user = await Usuario.findOne({ email });

        if( !user ) {
            const data = {
                email,
                name,
                password: ':P',
                image,
                role: 'USER_ROLE',
                google: true
            }

            user = new Usuario(data);

            await user.save();
        }

        //El usuario en bdd existe
        if( !user.state ) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        //Generar JWT
        const token = await generateJWT( user.id );        

        res.json({
            user,
            token
        });

    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }

}

module.exports = {
    login,
    googleSignIn
}