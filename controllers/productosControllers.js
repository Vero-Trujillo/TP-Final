// Requerir el esquema del producto (modelo)
const Productos = require('../models/productoModels');
const Usuarios = require('../models/usuarioModels');

const mongoose = require('mongoose');

// Función para requerir los panes
const obtenerPanes = async (req, res) => {
    try {
        const productos = await Productos.find({ categoria: 'Panes' });
        const usuario = req.session.user;
        res.render('page/panes', { productos: productos, usuario: usuario });
    } catch (error) {
        console.error('Error al obtener los productos', error);
        res.status(500).json({ error: `Error al obtener los productos de la sección ${categoria}` });
    }
};

// Función para requerir los panificados salados
const obtenerSalados = async (req, res) => {
    try {
        const productos = await Productos.find({ categoria: 'Panificados salados' });
        const usuario = req.session.user;
        res.render('page/salados', { productos: productos, usuario: usuario });
    } catch (error) {
        console.error('Error al obtener los productos', error);
        res.status(500).json({ error: `Error al obtener los productos de la sección ${categoria}` });
    }
};

// Función para requerir los panificados dulces
const obtenerDulces = async (req, res) => {
    try {
        const productos = await Productos.find({ categoria: 'Panificados dulces' });
        const usuario = req.session.user;
        res.render('page/dulces', { productos: productos, usuario: usuario });
    } catch (error) {
        console.error('Error al obtener los productos', error);
        res.status(500).json({ error: `Error al obtener los productos de la sección ${categoria}` });
    }
};

// Función para requerir las masas
const obtenerMasas = async (req, res) => {
    try {
        const productos = await Productos.find({ categoria: 'Masas' });
        const usuario = req.session.user;
        res.render('page/masas', { productos: productos, usuario: usuario });
    } catch (error) {
        console.error('Error al obtener los productos', error);
        res.status(500).json({ error: `Error al obtener los productos de la sección ${categoria}` });
    }
};

// Función para mostrar el producto seleccionado
const productoSeleccionado = async (req, res) => {
    try {
        const producto = await Productos.findById(req.params.id);
        if (!producto) {
            return res.status(404).send('Producto no encontrado');
        }
        const usuarioId = req.session.user;
        let usuario = null;
        let esFavorito = false;
        if (usuarioId) {
            usuario = await Usuarios.findById(usuarioId).populate('productos_favoritos.producto_favoritos');
            usuario.productos_favoritos = usuario.productos_favoritos || [];
            esFavorito = usuario.productos_favoritos.some(fav => fav.producto_favoritos && fav.producto_favoritos.toString() === producto._id.toString());
        }
        res.render('page/seleccionado', { producto, usuario, esFavorito });
    } catch (error) {
        console.error('Error al obtener el producto', error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
};

// Función para mostrar el carrito de compras
const obtenerCarrito = async (req, res) => {
    try {
        const usuarioId = req.session.user;
        // Obtener el array productos_carrito del usuario logueado
        const usuarioCarrito = await Usuarios.findById(usuarioId).populate('productos_carrito.producto_carrito');
        // Chequear que el usuario esté logueado correctamnete
        if (!usuarioCarrito) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado en la base de datos' });
        }
        // Renderizar el carrito del usuario logueado
        res.render('page/carrito', { usuarioCarrito: usuarioCarrito, usuario: req.session.user });
        // Error
    } catch (error) {
        console.error('Error al acceder al carrito de compras', error);
        res.status(500).json({ success: false, message: 'Error al acceder al carrito de compras' });
    }
};

// Función para agregar productos al carrito
const agregarAlCarrito = async (req, res) => {
    try {
        const { producto_carrito, cantidad } = req.body;
        const usuarioId = req.session.user;
        // Buscar el usuario en la base de datos y chequear que haya una sesión iniciada
        const usuarioCarrito = await Usuarios.findById(usuarioId);
        if (!usuarioId) {
            return res.status(400).json({ success: false, message: 'Por favor, inicia sesión para continuar' });
        }
        // Buscar el producto en la base de datos por su ID
        const producto = await Productos.findById(producto_carrito);
        // Verificar si el producto ya está en el carrito
        const productoExistente = usuarioCarrito.productos_carrito.find(p => p.producto_carrito && p.producto_carrito.toString() === producto_carrito);
        if (productoExistente) {
            // Si el producto ya está en el carrito mostrar un mensaje de error
            return res.status(400).json({ success: false, message: `El producto ${producto.nombre_producto} ya está en el carrito` });
        } else {
            // Si el producto no está en el carrito, agregarlo
            usuarioCarrito.productos_carrito.push({
                producto_carrito: new mongoose.Types.ObjectId(producto_carrito),
                cantidad: parseInt(cantidad, 10) || 1
            });
        };
        // Guardar los cambios en el usuario
        await usuarioCarrito.save();
        // Mostrar mensaje de éxito
        return res.status(200).json({ success: true, message: `El producto "${producto.nombre_producto}" fue agregado al carrito` });
        // Error
    } catch (error) {
        console.error('Error en agregarAlCarrito:', error);
        res.status(500).json({ success: false, message: 'Error al agregar producto al carrito' });
    }
};

// Función para eliminar productos del carrito
const eliminarDelCarrito = async (req, res) => {
    try {
        const usuarioId = req.session.user;
        const productoId = req.params.id;
        // Buscar el usuario en la base de datos y chequear que esté logueado
        const usuarioCarrito = await Usuarios.findById(usuarioId);
        if (!usuarioCarrito) {
            return res.status(404).json({ success: false, message: 'Por favor, inicia sesión para continuar' });
        }
        // Eliminar el producto del carrito
        usuarioCarrito.productos_carrito = usuarioCarrito.productos_carrito.filter(p => p.producto_carrito.toString() !== productoId);
        // Guardar los cambios
        await usuarioCarrito.save();
        // Buscar el producto en la base de datos por su ID
        const producto = await Productos.findById(productoId);
        // Mostrar mensaje de éxito
        return res.status(200).json({ success: true, message: `El producto "${producto.nombre_producto}" fue eliminado del carrito` });
        // Error
    } catch (error) {
        console.error('Error al eliminar el producto del carrito', error);
        res.status(500).json({ success: false, message: 'Error al eliminar el producto del carrito' });
    }
};

// Función para actualizar la cantidad de un producto en el carrito
const actualizarCantidad = async (req, res) => {
    try {
        const usuarioId = req.session.user;
        const { id } = req.params;
        const { cantidad } = req.body;
        // Buscar el usuario en la base de datos y chequear que haya una sesión iniciada
        const usuarioCarrito = await Usuarios.findById(usuarioId);
        if (!usuarioCarrito) {
            return res.status(404).json({ success: false, message: 'Por favor, inicia sesión para continuar' });
        }
        // Buscar el producto en el carrito y actualizar la cantidad
        const productoCarrito = usuarioCarrito.productos_carrito.find(p => p.producto_carrito.toString() === id);
        if (productoCarrito) {
            productoCarrito.cantidad = parseInt(cantidad, 10);
            // Guardar los cambios
            await usuarioCarrito.save();
            // Mostrar mensaje de éxito o error
            return res.status(200).json({ success: true, message: 'Cantidad actualizada' });
        } else {
            return res.status(404).json({ success: false, message: 'Producto no encontrado en el carrito' });
        }
        // Error
    } catch (error) {
        console.error('Error actualizando la cantidad del producto:', error);
        res.status(500).json({ success: false, message: 'Error actualizando la cantidad del producto' });
    }
};

// Función para mostrar los favoritos
const obtenerFavoritos = async (req, res) => {
    try {
        const usuarioId = req.session.user;
        // Obtener el array productos_favoritos del usuario logueado
        const usuarioFavoritos = await Usuarios.findById(usuarioId).populate('productos_favoritos.producto_favoritos');
        // Chequear que el usuario esté logueado correctamnete
        if (!usuarioFavoritos) {
            return res.status(404).json({ success: false, message: 'Por favor, inicia sesión para continuar' });
        }
        // Renderizar el carrito del usuario logueado
        res.render('page/favoritos', { usuarioFavoritos: usuarioFavoritos, usuario: req.session.user });
        //Error
    } catch (error) {
        console.error('Error al acceder a los Favoritos', error);
        res.status(500).json({ success: false, message: 'Error al acceder a los Favoritos' });
    }
};

// Función para agregar productos a favoritos
const agregarAFavoritos = async (req, res) => {
    try {
        const producto_favoritos = req.body.producto_favoritos;
        const usuarioId = req.session.user;
        // Chequear que haya una sesión iniciada
        if (!usuarioId) {
            return res.status(400).json({ success: false, message: 'Por favor, inicia sesión para continuar' });
        }
        // Buscar el usuario en la base de datos 
        const usuarioFavoritos = await Usuarios.findById(usuarioId);
        // Buscar el producto en la base de datos por su ID
        const producto = await Productos.findById(producto_favoritos);
        // Verificar si el producto ya está en los favoritos
        const productoExistente = usuarioFavoritos.productos_favoritos.find(p => p.producto_favoritos && p.producto_favoritos.toString() === producto_favoritos);
        // Eliminar de favoritos si ya está agregado
        if (productoExistente) {
            usuarioFavoritos.productos_favoritos = usuarioFavoritos.productos_favoritos.filter(p => p.producto_favoritos.toString() !== producto_favoritos);
            await usuarioFavoritos.save();
            return res.status(200).json({ success: true, message: 'Producto eliminado de favoritos', action: 'removed' });
        // Guardar los cambios en el usuario
        } else {
            // Si el producto no está en los favoritos, agregarlo
            usuarioFavoritos.productos_favoritos.push({ producto_favoritos: producto._id });
            // Guardar los cambios en el usuario
            await usuarioFavoritos.save();
            return res.status(200).json({ success: true, message: 'Producto agregado a favoritos', action: 'added' });
        }
    } catch (error) {
        console.error('Error en agregarAFavoritos:', error);
        res.status(500).json({ success: false, message: 'Error al agregar producto a los Favoritos' });
    }
};

// Función para eliminar productos de favoritos
const eliminarDeFavoritos = async (req, res) => {
    try {
        const usuarioId = req.session.user;
        const productoId = req.params.id;
        // Buscar el usuario en la base de datos y chequear que esté logueado
        const usuarioFavoritos = await Usuarios.findById(usuarioId);
        if (!usuarioFavoritos) {
            return res.status(404).json({ success: false, message: 'Por favor, inicia sesión para continuar' });
        }
        // Eliminar el producto de los favoritos
        usuarioFavoritos.productos_favoritos = usuarioFavoritos.productos_favoritos.filter(p => p.producto_favoritos.toString() !== productoId);
        // Guardar los cambios
        await usuarioFavoritos.save();
        // Buscar el producto en la base de datos por su ID
        const producto = await Productos.findById(productoId);
        // Mostrar mensaje de éxito
        return res.status(200).json({ success: true, message: `El producto "${producto.nombre_producto}" fue eliminado de los favoritos` });
        // Error
    } catch (error) {
        console.error('Error al eliminar el producto de los favoritos', error);
        res.status(500).json({ success: false, message: 'Error al eliminar el producto de los favoritos' });
    }
};

// Exportar las funciones
module.exports = {
    obtenerPanes,
    obtenerSalados,
    obtenerDulces,
    obtenerMasas,
    productoSeleccionado,
    obtenerCarrito,
    obtenerFavoritos,
    agregarAlCarrito,
    agregarAFavoritos,
    eliminarDelCarrito,
    eliminarDeFavoritos,
    actualizarCantidad
};