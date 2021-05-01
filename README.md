# JWT

* El proyecto de express funciona con una base de datos MongoDB local llamada "jwt" con 2 colecciones llamadas "users" y "documents".
* Los usuarios tienen un username, un password con hash SHA512 y un role que puede ser "admin", "user" u "otro".
* En la ruta POST /documents un usuario con role == "admin" puede agregar cualquier documento a la colección "documents".
* Cualquier usuario puede ver los documentos en la ruta GET /documents.
* En la ruta POST /register se puede registrar un usuario con role "user".
