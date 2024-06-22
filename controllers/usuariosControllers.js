// Requerir el esquema del usuario (modelo)
const Usuarios = require('../models/usuarioModels');
// Requerir crypto
const crypto = require('crypto');

// Funciones para renderizar los formularios de registro y login
const obtenerRegistro = (req, res) => {
    const usuario = req.session.user;
    res.render('page/registro', { usuario: usuario })
};

const obtenerLogin = (req, res) => {
    const usuario = req.session.user || null;
    res.render('page/login', { usuario: usuario })
};

// Función para validar los caracteres usados en la contraseña
const validarContraseña = (password) => {
    const solicitarPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()\-_=+\\|{}\[\];:'",<.>/?]).{8,12}$/;
    return solicitarPassword.test(password);
};

// Función para encriptar la contraseña
const encriptarPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
};

// Función para agregar un nuevo usuario a la base de datos con la contraseña encriptada
const enviarUsuario = async (req, res) => {
    try {
        const { username, email, password, passwordconfirmation } = req.body;

        // Validar caracteres de la contraseña
        if (!validarContraseña(password)) {
            return res.status(400).json({ success: false, message: 'La contraseña debe tener entre 8 y 12 caracteres y contener al menos una letra mayúscula, una minúscula, un número y un carácter especial.' });
        }

        // Validar coincidencia de las contraseñas
        if (password !== passwordconfirmation) {
            return res.status(400).json({ success: false, message: 'Las contraseñas no coinciden.' });
        }

        // Verificar si el usuario ya existe
        const usuarioExistente = await Usuarios.findOne({ nombre_usuario: username });
        if (usuarioExistente) {
            return res.status(400).json({ success: false, message: 'El nombre de usuario ya está en uso. Por favor, ingresá otro nombre de usuario o iniciá sesión'});
        }

        // Encriptar contraseña
        const contraseniaEncriptada = encriptarPassword(password);
        // Crear el nuevo usuario con la contraseña encriptada
        await Usuarios.create({
            nombre_usuario: username,
            email: email,
            contraseña: contraseniaEncriptada
        });

        // Responder con éxito
        res.status(200).json({ success: true, message: `¡Gracias por registrarte ${username}!` });

    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.status(500).json({ success: false, message: 'Error al registrar el usuario' });
    }
};

// Función para autenticar si el usuario logueado existe y si la contraseña colocada es correcta
const autenticarUsuario = async (req, res) => {
    try {
        // Buscar el documento que tiene en el campo nombre_usuario el valor ingresado en el input "usuario"
        const { username, password } = req.body;
        const usuario = await Usuarios.findOne({ nombre_usuario: username });

        // Chequear que el usuario exista
        if (!usuario) {
            return res.render('page/login', { errorUsuario: 'Usuario no registrado.', errorContrasenia: null, usuario: null });
        }
        // Chequear que la contrseña ingresada sea la registrada
        const contraseniaEncriptada = encriptarPassword(password);
        if (usuario.contraseña !== contraseniaEncriptada) {
            return res.render('page/login', { errorUsuario: null, errorContrasenia: 'Contraseña incorrecta.', usuario: null });
        } else {
            // Si la información ingresada es correcta, inicia sesión y redirecciona al home
            req.session.user = usuario;
            res.redirect('/')
        }

    } catch (error) {
        console.error('Error al autenticar el usuario:', error);
        res.status(500).send('Error al autenticar el usuario');
    }
};

// Función para cerrar la sesión
const cerrarSesion = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.status(500).send('Error al cerrar sesión');
        }
        res.redirect('/');
    });
};

// Exportar las funciones
module.exports = {
    obtenerRegistro,
    obtenerLogin,
    enviarUsuario,
    autenticarUsuario,
    cerrarSesion
};