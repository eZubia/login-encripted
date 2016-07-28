var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt-nodejs');
var Usuario = require('./models/usuarios').Usuario;
var path = require('path');
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var routes = require('./routes/routes')(app, mongoose);
var Pendiente = require('./models/pendiente');

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

  socket.on('crearNuevoPendiente', function(data) {
    var newPendiente = new Pendiente({
      descripcion: data.descripcion,
      fecha: new Date(),
      prioridad: data.prioridad,
      terminada: false,
      usuario: mongoose.Types.ObjectId(data.idUsuario)
    });
    newPendiente.save(function(err, obj){
        if(err){
          socket.emit("fatalError");
        } else if(obj) {
          io.emit('recargarPendientes');
        }
    });
  });

  socket.on('deletePendiente', function(idPendiente){
    Pendiente.findById(idPendiente, function(err, todos) {
  		todos.remove(function(err) {
  			if(err) {
  				socket.emit("fatalError");
  			} else {
  				io.emit('recargarPendientes');
  			}
  		})
  	});
  });

  socket.on('terminarPendiente', function(idPendiente){
    Pendiente.update({"_id": idPendiente},
       {$set:{"terminada":true}}, function (err) {
          if (err) {
              socket.emit("fatalError");
          } else {
              io.emit('recargarPendientes');
          }
    });
  });

});

server.listen(port);
