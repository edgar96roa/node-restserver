const Role = require('../models/role');
const Usuario = require('../models/usuario');
const Categoria = require('../models/categoria');
const Producto = require('../models/producto');

const existsCategoria = async( id ) => {

    //verificar si la categoria existe
    const existeCategoria = await Categoria.findOne({id});
    if( !existeCategoria ) {
        throw new Error(`La categoria con el id ${ id } no existe`);
    }
}

const existsEmail = async( email = '' ) => {

    //verificar si el correo existe
    const existsEmail = await Usuario.findOne({ email });
    if( existsEmail ) {
        throw new Error(`El email ${email} ya está registrado`);
    }

}

const existsProducto = async( id ) => {
    
    //verificar si el producto existe
    const existeProducto = await Producto.findById(id).exec();
    
    if( !existeProducto ) {
        throw new Error(`El producto con el id ${ id } no existe`);
    }
    
}

const existsUserById = async( id ) => {

    const existsUserById = await Usuario.findById( id );
    if( !existsUserById ) {
        throw new Error(`El Id ${id} no existe`);
    }

}

const esRoleValido = async(role = '') => {

    const existsRole = await Role.findOne({ role });
    if( !existsRole ){
        throw new Error(`El role ${role} no está en la BD`);
    }

}

module.exports = {
    existsCategoria,
    existsEmail,
    existsProducto,
    existsUserById,
    esRoleValido
}