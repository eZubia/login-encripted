
module.exports = function(app, mongoose) {
  var Usuario = require('../models/usuarios').Usuario;
  var bodyParser = require('body-parser');
  var Pendiente = require('../models/pendiente.js');
  app.use(bodyParser.json()); //Application JSON
  app.use(bodyParser.urlencoded({extended:true}));

  //Regresa todas las tareas de la BD, petición GET
  findAllTodosForUser = function(req, res) {
    Pendiente.find({"usuario":mongoose.Types.ObjectId(req.params.id)})
    .exec(function(err, pendientes){
      if(err) return res.json("{}");
      return res.json(pendientes);
    });
  };

  //Regresa una tarea con un id específico, petición GET
  findById = function(req, res) {
  	ToDo.findById(req.params.id, function(err, todos) {
  		if(!err) {
        console.log('GET /todos/' + req.params.id);
  			res.send(todos);
  		} else {
  			console.log('Ha ocurrido un error al intentar obtener la tarea. ' + err);
  		}
  	});
  };

  //Inserta una nueva tarea, petición POST
  addPendiente = function(req, res) {
  	console.log('POST');
  	console.log(req.body);

  	var pendiente = new Pendiente({
  		descripcion:    req.body.descripcion,
  		fecha: 	  req.body.fecha,
  		prioridad:  req.body.prioridad,
  		terminada:   req.body.terminada,
      usuario: mongoose.Types.ObjectId(req.body.usurioOwner)
  	});

  	todo.save(function(err) {
  		if(!err) {
  			console.log('Nueva tarea ha sido creada.');
  		} else {
  			console.log('Ha ocurrido un error al intentar crear la tarea. ' + err);
  		}
  	});

  	res.send(todo);
  };

  //Actualiza una tarea existente, petición PUT
  updateTodo = function(req, res) {
  	ToDo.findById(req.params.id, function(err, todos) {
  		todos.descripcion   = req.body.petId;
  		todos.fecha    = req.body.year;
  		todos.prioridad = req.body.country;
  		todos.terminada  = req.body.poster;

  		todos.save(function(err) {
  			if(!err) {
  				console.log('Updated');
  			} else {
  				console.log('ERROR: ' + err);
  			}
  			res.send(todos);
  		});
  	});
  }

  //Eliminar una tarea específica, DELETE
  deleteTodo = function(req, res) {
  	ToDo.findById(req.params.id, function(err, todos) {
  		todos.remove(function(err) {
  			if(!err) {
  				console.log('Se ha eliminado tarea.');
  			} else {
  				console.log('ERROR: ' + err);
  			}
  		})
  	});
  }


  homeMain = function(req, res) {
    res.render('login');
  }

  registerUser = function(req, res) {
    res.render("registrar");
  }

  postUser = function(req, res) {
    console.log(req);
    console.log(req.body);
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
  }

  loginUser = function(req, res) {
    Usuario.findOne({'email': req.body.email})
    .exec(function(err, usuario){
      if(usuario !== null && usuario.validPassword(req.body.password)) {
        //res.send("Ha iniciado sesión....");
        console.log(usuario);
        Pendiente.find({"usuario": mongoose.Types.ObjectId(usuario._id)})
        .exec(function(err, pendientes){
          if(err) res.redirect("/");
          var pendientesJson = JSON.stringify(pendientes);
          console.log("length");
          console.log(pendientes.length);
          res.render('tasks', {usuario:usuario._id, pendientes:pendientesJson});
        });

      } else {
        res.render("no-sesion")
      }
    });
  }

  webService = function(req, res) {
    Usuario.findOne({'email': req.params.email})
    .exec(function(err, usuario){
      if(err) return res.json("{}");
      if(usuario !== null && usuario.validPassword(req.params.password)) {
          return res.json(usuario);
      } else {
          return res.json("{}");
      }
    });
  }


  //Rutas
  app.get('/todos/user/:id', findAllTodosForUser);
  app.get('/todos/:id', findById);
  app.post('/todos', addPendiente);
  app.put('/todos/:id', updateTodo);
  app.delete('/todos/:id', deleteTodo);

  app.get('/', homeMain);
  app.get('/registrar', registerUser);
  app.post('/registrar', postUser);
  app.post('/login', loginUser);
  app.get('/webservice/:email/:password', webService);

}
