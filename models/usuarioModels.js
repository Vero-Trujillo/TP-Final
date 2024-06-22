// Requerir Mongoose
const mongoose = require('mongoose');

// Esquema de la información de cada usuario
const usuarioEsquema = new mongoose.Schema({
    nombre_usuario: String,
    email: String,
    contraseña: String,
    productos_carrito: [
        {
            producto_carrito: { type: mongoose.Schema.Types.ObjectId, ref: 'Productos' },
            cantidad: { type: Number, default: 1 }
        }
    ],
    productos_favoritos: [
        {
            producto_favoritos: { type: mongoose.Schema.Types.ObjectId, ref: 'Productos' },
        }
    ],
});

// Exportar la variable donde se almacena el esquema de la información de los usuario
const Usuarios = mongoose.model('Usuarios', usuarioEsquema);
module.exports = Usuarios;