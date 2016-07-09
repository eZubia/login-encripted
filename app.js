var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt-nodejs');
var Usuario = require('./models/usuarios').Usuario;

app.set("view engine", "jade");
app.use(bodyParser.json()); //Application JSON
app.use(bodyParser.urlencoded({extended:true}));// Multipart con array

app.get("/", function(req,res){
  res.render("login");
});

app.get("/registrar", function(req,res){
  res.render("registrar");
});

app.post("/registrar", function(req,res){
  var usuarioNuevo = new Usuario({
    nombre: req.body.nombre,
    paterno: req.body.paterno,
    materno: req.body.materno,
    email: req.body.email
  });
  usuarioNuevo.generateHash(req.body.password);
  usuarioNuevo.save(function (err) {
      if (err) {
          throw err;
      }
      res.redirect("/");
  });
});

app.post('/login', function(req, res) {
  Usuario.findOne({'email': req.body.email})
  .exec(function(err, usuario){
    if(usuario.validPassword(req.body.password)) {
      res.send("Ha iniciado sesión....");
    } else {
      res.send("No inicio sesión");
    }

  });
});

app.listen(8081);
