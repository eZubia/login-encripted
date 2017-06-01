/**
 * Created by erikzubia on 5/28/17.
 */

module.exports = function(app, mongoose) {
    var Usuario = require('./../../models/usuarios').Usuario;
    var bodyParser = require('body-parser');
    var Proyecto = require('./../../models/proyectos');
    var Historia = require('./../../models/historia');

    //Regresa todas las tareas de la BD, petición GET
    findProyectosScrumByIdUsuario = function(req, res) {
        Proyecto.find({"scrumMaster":mongoose.Types.ObjectId(req.params.id)})
            .populate("desarrolladores")
            .exec(function(err, proyectos){
                if(err) return res.json("{}");
                return res.json(proyectos);
            });
    };

    findProyectosManagerByIdUsuario = function(req, res) {
        Proyecto.find({"proyectManager":mongoose.Types.ObjectId(req.params.id)})
            .populate("desarrolladores")
            .exec(function(err, proyectos){
                if(err) return res.json("{}");
                return res.json(proyectos);
            });
    };

    findProyectosDeveloperByIdUsuario = function(req, res) {
        Proyecto.find({"desarrolladores":mongoose.Types.ObjectId(req.params.id)})
            .populate("desarrolladores")
            .exec(function(err, proyectos){
                if(err) return res.json("{}");
                return res.json(proyectos);
            });
    };

    //Regresa una tarea con un id específico, petición GET
    findById = function(req, res) {
        Proyecto.findById(req.params.id, function(err, proyecto) {
            if(!err) {
                return res.json(proyecto);
            } else {
                console.log('Ha ocurrido un error al intentar obtener el proyecto. ' + err);
            }
        });
    };

    //Inserta una nueva tarea, petición POST
    addProyecto = function(req, res) {
        var proyecto = new Proyecto({
            nombreProyecto:    req.body.nombreProyecto,
            fechaSolicitud: 	  new Date(),
            descripcionProy:   req.body.descripcionProy,
            scrumMaster:   mongoose.Types.ObjectId(req.body.scrumMaster),
            proyectManager:   mongoose.Types.ObjectId(req.body.proyectManager),
            abierto: true
        });

        proyecto.save(function(err) {
            if(!err) {
                return res.json(proyecto);
            } else {
                return res.json("error");
            }
        });
    };

    addDeveloper = function(req, res) {
        Proyecto.findById(req.body.id).populate("desarrolladores").exec(function (err, proyecto) {
            if(err) {
                return res.json("notFound");
            } else {
                Usuario.findById(req.body.idUsuario).exec(function (err, usuario) {
                    var isAlReadyIn = false;
                    proyecto.desarrolladores.forEach(function (desarrollador) {
                        if(desarrollador._id.toString() === usuario._id.toString()){
                            console.log("BBB");
                            isAlReadyIn = true;
                        }
                    });
                    if(isAlReadyIn){
                        return res.json("developer-already-in")
                    } else {
                        proyecto.desarrolladores.push(usuario);
                        proyecto.save(function(err) {
                            if(!err) {
                                return res.json("developer-added");
                            } else {
                                return res.json("no-developer-add");
                            }
                        });
                    }
                });
            }
        });
    };

    removeDeveloper = function(req, res) {
        Proyecto.findById(req.body.id).exec(function (err, proyecto) {
            if(err) {
                return res.json("notFound");
            } else {
                for (var i =0; i < proyecto.desarrolladores.length; i++)
                    if (proyecto.desarrolladores[i].toString() === req.body.idUsuario) {
                        proyecto.desarrolladores.splice(i,1);
                        break;
                    }
                proyecto.save(function(err) {
                    if(!err) {
                        return res.json("remove-developer-done");
                    } else {
                        return res.json("no-developer-remove");
                    }
                });
            }
        });
    };

    finshProyect = function(req, res) {
        Historia.find({"sprint": mongoose.Types.ObjectId(req.body.id)})
            .exec(function (err, historias) {
                var canFinish = true;
                if(historias.length > 0){
                    historias.forEach(function (historia) {
                        canFinish = canFinish && historia.terminada && historia.revisada;
                    });
                }
                if(canFinish){
                    Proyecto.findByIdAndUpdate({"_id": mongoose.Types.ObjectId(req.body.idProyecto)}, { $set: { abierto: false }}, { new: true }, function (err, proyecto) {
                        if (err) {
                            return res.json("error", err);
                        } else {
                            return res.json(proyecto);
                        }
                    });
                } else {
                    return res.json("cant-finish");
                }
            });
    };

    deleteProyecto = function(req, res) {
        Proyecto.findById(req.body.id, function(err, proyecto) {
            proyecto.remove(function(err) {
                if(!err) {
                    return res.json("ok");
                } else {
                    return res.json("error");
                }
            })
        });
    };

    //Rutas
    app.get('/proyectos/findProyectosScrum/:id', findProyectosScrumByIdUsuario);
    app.get('/proyectos/findProyectosManager/:id', findProyectosManagerByIdUsuario);
    app.get('/proyectos/findProyectosDeveloper/:id', findProyectosDeveloperByIdUsuario);
    app.get('/proyectos/findById/:id', findById);
    app.post('/proyectos/addProyecto', addProyecto);
    app.post('/proyectos/addDeveloper', addDeveloper);
    app.post('/proyectos/removeDeveloper', removeDeveloper);
    app.post('/proyectos/finish/:id', finshProyect);
    app.post('/proyectos/delete-proyecto', deleteProyecto);

};
