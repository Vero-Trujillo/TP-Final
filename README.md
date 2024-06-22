La aplicación está hecha con nodeJS y MongoDB Atlas.
Las variables de entorno usadas son:

PORT = 3072
MONGO_URL = mongodb+srv://vero3802:mancuspia@cluster0.aiejggf.mongodb.net/Panadería

Creo que con eso puede entrar tanto al Mongo como levantar el servidor.

Fuunciona el login de usuario y el registro. Al loguease un usuario cambia el header y salen los link para crear cuenta y login y aparecen los de cerrar sesión, favoritos y carrito, además del nombre del usuario.

En el carrito de compras se pueden agregar productos y cambiar la cantidad de cada uno. También se pueden eliminar productos. Para eliminar los productos del carrito pide confirmación.

En los favoritos se pueden agregar productos desde el ícono al lado del producto (sólo está disponible si el usuario está logueado) y se pueden eliminar desde el mismo ícono o desde la página de favoritos. Para eliminar un producto desde favoritos pide confirmación (si se elimina desde el ícono no pide confirmación porque en caso de arrepentirse es sólo volver a clickear el ícono, me parecía molesto tener que confirmar). Todo eso funciona. Lo único que no funciona es que el ícono de los favoritos cambia de color al agregar el producto a favoritos pero si se navega por la página y se vuelve a seleccionar el producto ya no tiene el color cambiado (aunque el producto sigue en la lista de favoritos y en el Documento de Mongo). 

El formulario de contacto envía un mensaje falso de éxito porque el formulario en realidad no se envía.

El botón de comprar redirige a una página de éxito ficticia también.

Use SweetAlert2 para los mensajes que deben aparecer en la interfaz del usuario. Me gustaba más que la página de éxito que vimos en clase.
