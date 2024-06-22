// Requerir express router
const express = require('express');
const router = express.Router();
// Requerir las funciones con las peticiones GET
const { obtenerRegistro, obtenerLogin, enviarUsuario, autenticarUsuario, cerrarSesion } = require('../controllers/usuariosControllers');

// Rutas GET para los formularios de registro y login
router.route('/registro').get(obtenerRegistro);
router.route('/login').get(obtenerLogin);
router.route('/logout').get(cerrarSesion);
// Rutas POST para los formularios de registro y login
router.route('/nuevoUsuario').post(enviarUsuario);
router.route('/sesionIniciada').post(autenticarUsuario);

// Exportar la variabel con las rutas
module.exports = router;