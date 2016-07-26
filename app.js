var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt-nodejs');
var Usuario = require('./models/usuarios').Usuario;
var path = require('path');
var port = process.env.PORT || 8080;
var routes = require('./routes/routes')(app);

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
    console.log("AAAAA");
    socket.emit('echo back', data);
  });

  socket.on('mensajeNuevo', function(data) {
    console.log(data);
    io.emit('enviarMensajes', "Este es un mensaje");
  });
});





server.listen(port);
