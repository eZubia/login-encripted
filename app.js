var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt-nodejs');
var Usuario = require('./models/usuarios').Usuario;
require('./models/proyectos');
require('./models/sprint');
require('./models/historia');
var path = require('path');
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/scrum_dev');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use("/public", express.static(__dirname + "/public"));
app.use(bodyParser.json()); //Application JSON
app.use(bodyParser.urlencoded({extended:true}));// Multipart con array
var routes = require('./routes/routes')(app, mongoose);
var pendientes = require('./routes/proyectos/proyectosController')(app, mongoose);
var historias = require('./routes/historias/historiasController')(app, mongoose);
var sprints = require('./routes/sprints/sprintsController')(app, mongoose);

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

    socket.on('crearProyecto', function(data) {
        var proyecto = new Proyecto({
            nombreProyecto:    req.body.nombreProyecto,
            fechaSolicitud: 	  req.body.fechaSolicitud,
            fechaArranque:  req.body.fechaArranque,
            descripcionProy:   req.body.descripcionProy,
            scrumMaster:   mongoose.Types.ObjectId(req.body.scrumMaster),
            proyectManager:   mongoose.Types.ObjectId(req.body.proyectManager),
            abierto: true
        });

        proyecto.save(function(err) {
            if(!err) {
                socket.emit("recargarProyectos")
            } else {
                socket.emit("failSaveProyecto")
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
