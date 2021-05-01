let jwt = require("jsonwebtoken");
let config = require("./config");
const Mongolib = require("./db/mongolib");
const util = require("util");
let crypto = require("crypto");

// Clase encargada de la creación del token
class HandlerGenerator {
  login(req, res) {
    Mongolib.getDatabase((db) => {
      Mongolib.findUsers(db, (docs) => {
        let users = docs;
        // Extrae el usuario y la contraseña especificados en el cuerpo de la solicitud
        let username = req.body.username;
        let password = req.body.password;
        let user;

        // Este usuario y contraseña, en un ambiente real, deben ser traidos de la BD
        let mockedUsername = "admin";
        let mockedPassword = "password";

        // Si se especifico un usuario y contraseña, proceda con la validación
        // de lo contrario, un mensaje de error es retornado
        if (username && password) {
          users.forEach((element) => {
            if (element.username == username) {
              user = element;
            }
          });

          let hashedPass = crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");
          let correctHash = user.password;
          // Si los usuarios y las contraseñas coinciden, proceda con la generación del token
          // de lo contrario, un mensaje de error es retornado
          if (hashedPass === correctHash) {
            // Se genera un nuevo token para el nombre de usuario el cuál expira en 24 horas
            let token = jwt.sign(
              { username: username, role: user.role },
              config.secret,
              {
                expiresIn: "24h",
              }
            );

            // Retorna el token el cuál debe ser usado durante las siguientes solicitudes
            return res.json({
              success: true,
              message: "Authentication successful!",
              token: token,
            });
          } else {
            // El error 403 corresponde a Forbidden (Prohibido) de acuerdo al estándar HTTP
            return res.status(403).send({
              success: false,
              message: "Incorrect username or password",
            });
          }
        } else {
          // El error 400 corresponde a Bad Request de acuerdo al estándar HTTP
          return res.status(403).send({
            success: false,
            message: "Authentication failed! Please check the request",
          });
        }
      });
    });
  }

  index(req, res) {
    // Retorna una respuesta exitosa con previa validación del token
    return res.json({
      success: true,
      message: "Index page",
    });
  }

  create(req, res) {
    console.log(req.decoded);
    let user = req.decoded;
    console.log(req.body);
    if (user.role == "admin") {
      Mongolib.getDatabase((db) => {
        Mongolib.createDocument(db, req.body);
        return res.json({
          success: true,
          message: "Document created",
        });
      });
    } else {
      // El error 400 corresponde a Bad Request de acuerdo al estándar HTTP
      return res.status(403).send({
        success: false,
        message: "Rol no autorizado",
      });
    }
  }

  getDocuments(req, res) {
    Mongolib.getDatabase((db) => {
      Mongolib.getAllDocuments(db, (docs) => {
        return res.send(docs);
      });
    });
  }

  register(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    if (username && password) {
      let hashedPass = crypto
        .createHash("sha512")
        .update(password)
        .digest("hex");
      let newUser = { username: username, password: hashedPass, role: "user" };
      Mongolib.getDatabase((db) => {
        Mongolib.register(db, newUser);
        return res.json({
          success: true,
          message: "User created",
        });
      });
    }else {
        // El error 400 corresponde a Bad Request de acuerdo al estándar HTTP
        return res.status(400).send({
          success: false,
          message: "Request must have username and password",
        });
      }
  }
}

module.exports = HandlerGenerator;
