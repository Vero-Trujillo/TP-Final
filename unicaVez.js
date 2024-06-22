// Requerir el paquete dotenv
require('dotenv').config();
// Requerir la conexión con la base de datos (config), el esquema (models) y los productos cargados (JSON)
const connectDB = require('./config/connectDB');
const Productos = require('./models/productoModels');
const productosJSON = require('./productos.json');

// Función para cargar inicialmente los productos a MongoDB
const iniciar = async () => {
    try {
        await connectDB(process.env.MONGO_URL);
        await Productos.create(productosJSON);
        console.log('Se agregaron los productos iniciales a la base de datos');
    } catch (error) {
        console.log(error)
    }
};

iniciar();