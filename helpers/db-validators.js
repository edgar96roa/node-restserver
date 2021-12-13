const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRoleValido = async(role = '') => {

    const existsRole = await Role.findOne({ role });
    if( !existsRole ){
        throw new Error(`El role ${role} no está en la BD`);
    }

}

const existsEmail = async( email = '' ) => {

    //verificar si el correo existe
    const existsEmail = await Usuario.findOne({ email });
    if( existsEmail ) {
        throw new Error(`El email ${email} ya está registrado`);
    }

}

const existsUserById = async( id ) => {

    const existsUserById = await Usuario.findById( id );
    if( !existsUserById ) {
        throw new Error(`El Id ${id} no existe`);
    }

}

module.exports = {
    esRoleValido,
    existsEmail,
    existsUserById
}