// Requerir express router
const express = require('express');
const router = express.Router();
// Requerir las funciones con las peticiones GET
const { obtenerPanes, obtenerSalados, obtenerDulces, obtenerMasas, productoSeleccionado, obtenerCarrito, 
    obtenerFavoritos, agregarAlCarrito, agregarAFavoritos, eliminarDelCarrito, eliminarDeFavoritos, 
    actualizarCantidad} = require('../controllers/productosControllers');

// Ruta GET para: Panes / Panificados salados / Panificados dulces / Masas
router.route('/panes').get(obtenerPanes);
router.route('/salados').get(obtenerSalados);
router.route('/dulces').get(obtenerDulces);
router.route('/masas').get(obtenerMasas);
// Ruta GET para ver más detalles de un producto seleccionado
router.route('/productoSeleccionado/:id').get(productoSeleccionado);
// Ruta GET para el carrito de compras y los favoritos
router.route('/carrito').get(obtenerCarrito);
router.route('/favoritos').get(obtenerFavoritos);

// Rutas POST para agregar productos al carrito y a Favoritos
router.route('/agregarAlCarrito').post(agregarAlCarrito);
router.route('/agregarAFavoritos').post(agregarAFavoritos);
// Rutas POST para eliminar productos del carrito y de Favoritos
router.route('/eliminarDelCarrito/:id').post(eliminarDelCarrito);
router.route('/eliminarDeFavoritos/:id').post(eliminarDeFavoritos);
// Ruta PUT (patch en este caso) para actualizar la cantidad de productos del carrito
// router.route('/productos/actualizarCantidad/:id').patch(actualizarCantidad);
router.route('/actualizarCantidad/:id').post(actualizarCantidad);

// Exportar la variabel con las rutas
module.exports = router;