document.addEventListener("DOMContentLoaded", function () {
// Obtengo los inputs y los <p> desde registro.ejs para mostrar el mensaje de los caracteres de la contraseña
// y de la coincidencia entre contraseñas
    const inputPassword = document.getElementById('password');
    const mensajePassword = document.getElementById('passwordMje');
    const inputConfirmPassword = document.getElementById('passwordconfirmation');
    const mensajeConfirmPassword = document.getElementById('confirmPasswordMje');
// Obtengo los iconos desde registro.ejs y login.ejs para ver u ocultar la contraseña y la confirmación
    const cambiarPassword = document.getElementById('cambiarPassword');
    const cambiarConfirmarPassword = document.getElementById('cambiarConfirmarPassword');
// Obtengo el form desde registro.ejs para validar si el usuario ya existe antes de enviar el formulario de registro
    const formRegistro = document.getElementById('registroForm');

    // Función para validar los caracteres de la contraseña
    const validarCaracteres = () => {
        const password = inputPassword.value;
        const solicitarPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()\-_=+\\|{}\[\];:'",<.>/?]).{8,12}$/;

        if (!solicitarPassword.test(password)) {
            mensajePassword.textContent = 'La contraseña debe tener entre 8 y 12 caracteres y contener al menos una letra mayúscula, una minúscula, un número y un carácter especial.';
            return false;
        } else {
            mensajePassword.textContent = '';
            return true;
        }
    };

    // Función para validar la coincidencia de la contraseña y su confirmación
    const validarCoincidencia = () => {
        const password = inputPassword.value;
        const confirmPassword = inputConfirmPassword.value;

        if (password !== confirmPassword) {
            mensajeConfirmPassword.textContent = 'Las contraseñas no coinciden.';
            return false;
        } else {
            mensajeConfirmPassword.textContent = '';
            return true;
        }
    };

    // Función para mostrar u ocultar la contraseña
    const cambiarVisibilidad = (inputElemento, cambiarElemento) => {
        const type = inputElemento.getAttribute('type') === 'password' ? 'text' : 'password';
        inputElemento.setAttribute('type', type);

        cambiarElemento.querySelector('i').className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
    };

    // Mostrar u ocultar la contraseña y la confirmación de la contraseña al hacer clic en el ícono
    cambiarPassword.addEventListener('click', () => {
        cambiarVisibilidad(inputPassword, cambiarPassword);
    });
    cambiarConfirmarPassword.addEventListener('click', () => {
        cambiarVisibilidad(inputConfirmPassword, cambiarConfirmarPassword);
    });

    // Validar los caracteres de la contraseña y la coincidencia al clickear en el input
    inputPassword.addEventListener('input', validarCaracteres);
    inputConfirmPassword.addEventListener('input', validarCoincidencia);

    // Función para mostrar mensaje (con SweetAlert2) de usuario ya existente (si corresponde) del lado cliente
    const validarFormulario = async (event) => {
        event.preventDefault();

        const formData = new FormData(formRegistro);
        const data = Object.fromEntries(formData);

        try {
            const response = await fetch('/usuarios/nuevoUsuario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message);
            }

            if (!result.success) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: result.message,
                });
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'Usuario registrado exitosamente',
                    text: result.message,
                    timer: 3000,
                    showConfirmButton: false,
                }).then(() => {
                    window.location.href = '/usuarios/login';
                });
            }
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El nombre de usuario ya está en uso. Por favor, ingresá otro nombre de usuario o iniciá sesión',
            });
        }
    };

    // Agregar el evento de validación al enviar el formulario
    formRegistro.addEventListener('submit', validarFormulario);
});

// Mostrar un mensaje de confirmación al cerrar sesión con SweetAlert2
    document.addEventListener('DOMContentLoaded', function() {
        const logoutLink = document.getElementById('cerrar-sesion');
        if (logoutLink) {
            logoutLink.addEventListener('click', function(event) {
                event.preventDefault();
                Swal.fire({
                    title: '¿Estás seguro de que deseas cerrar sesión?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#238097',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sí, cerrar sesión',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = this.href;
                    }
                });
            });
        }
    });