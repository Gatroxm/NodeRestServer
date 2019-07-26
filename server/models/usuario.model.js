const mongoose = require('mongoose');
let Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

let roles = {
    values: ['ADMIN_ROLE','USER_ROLE'],
    message: '{VALUE} no es un rol esperado'
};

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        require: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        require: [true, 'El email es necesario']
    },
    password: {
        type: String,
        require: [true, 'El password es necesario']
    },
    img: {
        type: String,
        require: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: roles
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

usuarioSchema.methods.toJSON = function() {

    let user = this;
    let userObjet = user.toObject();
    delete userObjet.password;
    return userObjet;

}

usuarioSchema.plugin( uniqueValidator, '{PATH} deve ser unico');

module.exports = mongoose.model('Usuario', usuarioSchema);