// Paquetes requeridos (express, body parser, dotenv y express-session)
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();
const session = require('express-session');
// Requerir el esquema (models), la conexión con la base de datos (config) y las rutas (routes)
const Productos = require('./models/productoModels');
const Usuarios = require('./models/usuarioModels');
const connectDB = require('./config/connectDB');
const productosRouter = require('./routes/productosRoutes');
const usuariosRouter = require('./routes/usuariosRoutes');

// Configuración middware
// Formatos (body-parser)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Motor de plantilla
app.set('view engine', 'ejs');
// Archivos estáticos
app.use(express.static(__dirname + '/public'));
// Configuración de la sesión
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
}));
// Configuración para verificar que el usuario logueado esté registrado
function autenticacionUsuario(req, res, next) {
    if(req.session.user){
        return next()
    } else {
        res.redirect('/usuarios/login')
    }
};
// Asignarle un path a productosRoutes y a usuariosRoutes
app.use('/productos', productosRouter);
app.use('/usuarios', usuariosRouter);

// Ruta GET de Inicio, Contacto y Nosotros
app.get('/', (req, res) => {
    const usuario = req.session.user;
    res.render('page/inicio', { usuario })
});

app.get('/contacto', (req, res) => {
    const usuario = req.session.user;
    res.render('page/contacto', { usuario })
});

app.get('/nosotros', (req, res) => {
    const usuario = req.session.user;
    res.render('page/nosotros', { usuario })
});

app.get('/compra', (req, res) => {
    const usuario = req.session.user;
    res.render('page/compraRealizada', { usuario })
});

// Ruta POST para el envío (simulado) del formulario de contacto
app.post('/', (req, res) => {
    let nombreContacto = req.body.nombreContacto;
    res.json({ success: true, message: `Muchas gracias por tu mensaje ${nombreContacto}. Te responderemos a la brevedad` });
});

// Función para cargar los productos iniciales a la base de datos
const iniciar = async () => {
    try {
        await connectDB(process.env.MONGO_URL)
    } catch (error) {
        console.log(error)
    }
};

iniciar();

// Puerto
app.listen(process.env.PORT, () => {
    console.log('servidor corriendo')
});
