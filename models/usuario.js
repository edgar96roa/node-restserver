// {
//     "name": "",
//     "email": "",
//     "password": "",
//     "image": "",
//     "role": "",
//     "state": false,
//     "createdByGoogle": false
// }

const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio']
    },
    image: {
        type: String
    },
    role: {
        type: String,
        required: true,
        enum: ['ADMIN_ROLE', 'USER_ROLE', 'SELLS_ROLE']
    },
    state: {
        type: Boolean,
        default: true
    },
    createdByGoogle: {
        type: Boolean,
        default: false
    },
});

//Debe ser una función normal porqué voy a usar el objeto this
//y una function normal mantiene a lo que apunta el this
//fuera de la misma, y yo necesito tener el this porqué va a hacer referencia
//a la instancia que tengo creada
UsuarioSchema.methods.toJSON = function() {
    const { __v, password, ...user } = this.toObject();
    return user;
}

module.exports = model( 'Usuario', UsuarioSchema );