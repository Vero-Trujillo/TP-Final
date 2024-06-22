// Requerir Mongoose
const mongoose = require('mongoose');

// Esquema de la información de cada producto
const productoEsquema = new mongoose.Schema({
    nombre_producto: String,
    categoria: String,
    tipo: String,
    descripcion: String,
    imagen: String,
    precio: Number,
});

// Exportar la variable donde se almacena el esquema de la información de los productos
const Productos = mongoose.model('Productos', productoEsquema);
module.exports = Productos;