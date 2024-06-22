// Asegurarse que se cargue todo el documento antes de ejecutar la función
document.addEventListener('DOMContentLoaded', function () {
    // Función para actualizar la cantidad total de productos en el carrito
    const actualizarCantidadTotalProductos = () => {
        let cantidadTotal = 0;
        document.querySelectorAll('.cantidad-input').forEach(input => {
            cantidadTotal += parseInt(input.value);
        });
        document.querySelector('.cantidadProductos').innerText = `Cantidad de productos: ${cantidadTotal}`;
    };
    // Función para actualizar la cantidad de cada producto en el input
    const updateCantidad = async (productoId, nuevaCantidad) => {
        try {
            // Obtener el producto y pasarlo a formato JSON
            const respuesta = await fetch(`/productos/actualizarCantidad/${productoId}?_method=PATCH`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cantidad: nuevaCantidad }),
            });
            const resultado = await respuesta.json();
            // Calcular los subtotales y el total    
            if (resultado.success) {
                // Actualizar el input de cantidad
                const input = document.querySelector(`.cantidad-input[data-producto-id="${productoId}"]`);
                input.value = nuevaCantidad;    
                // Obtener el precio unitario del producto
                const precioUnitario = parseFloat(document.querySelector(`.precioCarrito[data-producto-id="${productoId}"]`).getAttribute('data-precio'));    
                // Calcular el nuevo subtotal del producto
                const totalProducto = precioUnitario * nuevaCantidad;
                document.querySelector(`.precioCarrito[data-producto-id="${productoId}"]`).innerText = `$ ${totalProducto.toFixed(2)}`;    
                // Calcular el total del carrito y la cantidad de productos
                calcularTotal();
                actualizarCantidadTotalProductos();
                return { success: true };
            } else {
                console.error(resultado.message);
                return { success: false, message: resultado.message };
            }
        } catch (error) {
            console.error('Error en la solicitud fetch:', error);
            return { success: false, message: 'Error al actualizar la cantidad' };
        }
    };

    // Function para calcular el total del carrito
    const calcularTotal = () => {
        let total = 0;
        document.querySelectorAll('.productoCarrito').forEach(productoElemento => {
            const productoId = productoElemento.getAttribute('data-producto-id');
            const cantidad = parseInt(document.querySelector(`.cantidad-input[data-producto-id="${productoId}"]`).value);
            const precioUnitario = parseFloat(document.querySelector(`.precioCarrito[data-producto-id="${productoId}"]`).getAttribute('data-precio'));
            const subtotalProducto = cantidad * precioUnitario;
            total += subtotalProducto;
        });
        document.getElementById('totalCarrito').innerText = `$ ${total.toFixed(2)}`;
    };

    // Aumenta o disminuir la cantidad del input con los botones + y -
    document.querySelectorAll('.btn-cantidad').forEach(button => {
        button.addEventListener('click', async (event) => {
            const productoId = button.getAttribute('data-producto-id');
            const input = document.querySelector(`.cantidad-input[data-producto-id="${productoId}"]`);
            let cantidad = parseInt(input.value);
            // Indicar la acción de cada uno de los botones
            if (button.classList.contains('mas')) {
                cantidad++;
            } else if (button.classList.contains('menos') && cantidad > 1) {
                cantidad--;
            }    
            // Actualizar la cantidad
            const resultado = await updateCantidad(productoId, cantidad);
            if (resultado.success) {
                input.value = cantidad;
                calcularTotal();
                actualizarCantidadTotalProductos();
            } else {
                console.error(resultado.message);
            }
        });
    });

    // Realizar los cambios en el precio total y la cantidad de productos desde el input
    document.querySelectorAll('.cantidad-input').forEach(input => {
        input.addEventListener('change', async (event) => {
            const productoId = input.getAttribute('data-producto-id');
            let nuevaCantidad = parseInt(input.value);
            if (nuevaCantidad < 1) {
                nuevaCantidad = 1;
                input.value = 1;
            }
            const resultado = await updateCantidad(productoId, nuevaCantidad);
            if (resultado.success) {
                input.value = nuevaCantidad;
                calcularTotal();
                actualizarCantidadTotalProductos();
            } else {
                console.error(resultado.message);
            }
        });
    });

    calcularTotal();
    actualizarCantidadTotalProductos();
});