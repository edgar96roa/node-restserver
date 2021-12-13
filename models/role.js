// {
//     "role": ""
// }
const { Schema, model } = require('mongoose');

const RoleSchema = Schema({
    role: {
        type: String,
        required: [true, 'El role es obligatorio'],
        enum: ['ADMIN_ROLE', 'USER_ROLE', 'SELLS_ROLE']
    },
});

module.exports = model( 'Role', RoleSchema );