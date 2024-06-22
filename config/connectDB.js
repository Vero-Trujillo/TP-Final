// Requerir Mongoose
const mongoose = require('mongoose');

// Conexión con la base de datos
const connectDB = async () => {
    try {
        const respuesta = await mongoose.connect(process.env.MONGO_URL);
        console.log('Se conectó la base de datos')
    } catch (error) {
        console.log(error)
    }
};

// Exportar la variable con la conexión a la base de datos
module.exports = connectDB;
