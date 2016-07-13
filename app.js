var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt-nodejs');
var Usuario = require('./models/usuarios').Usuario;
var path = require('path');
var port = process.env.PORT || 8080;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use("/public", express.static(__dirname + "/public"));
app.use(bodyParser.json()); //Application JSON
app.use(bodyParser.urlencoded({extended:true}));// Multipart con array

var server = require('http').Server(app);
var io = require("socket.io")(server);

var mensajes = [{
  id: 1,
  texto: "AMO A RINGO STARR",
  emisor: "José Luis"
}];

io.on('connect', function(socket) {
  console.log("Se ha realizado una conexión...");
  socket.emit('enviarMensajes', mensajes);

  socket.on('echo', function(data) {
    socket.emit('echo back', data);
  });

  socket.on('mensajeNuevo', function(data) {
    console.log(data);
    io.emit('enviarMensajes', "Este es un mensaje");
  });
});



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
    if(usuario !== null && usuario.validPassword(req.body.password)) {
      //res.send("Ha iniciado sesión....");
      res.render('welcome');
    } else {
      //res.send("No inicio sesión...");
      res.render("no-sesion")
    }

  });
});

app.get('/webservice/:email/:password', function(req, res) {
  Usuario.findOne({'email': req.params.email})
  .exec(function(err, usuario){
    if(err) return res.json("{}");
    if(usuario !== null && usuario.validPassword(req.params.password)) {
        return res.json(usuario);
    } else {
        return res.json("{}");
    }
  });
});


server.listen(port);
