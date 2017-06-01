/**
 * Created by erikzubia on 5/28/17.
 */

module.exports = function(app, mongoose) {
    var Historia = require('./../../models/historia');

    findBacklogByProyecto= function(id, callback) {
        Historia.find({"proyecto":mongoose.Types.ObjectId(id), "sprint":{$exists:false}})
            .exec(function(err, historias){
                if(err) {
                    callback("error")
                } else {
                    callback(historias);
                }
            });
    };

    findBacklogByProyectoRequest= function(req, res) {
        findBacklogByProyecto(req.params.id, function (historias) {
            return res.json(historias);
        })
    };

    //Regresa todas las tareas de la BD, petición GET
    findHistoriasBySprint= function(id, callback) {
        Historia.find({"sprint":mongoose.Types.ObjectId(req.params.id)})
            .exec(function(err, historias){
                if(err) {
                    callback("error")
                } else {
                    callback(historias);
                }
            });
    };

    findHistoriasBySprintRequest= function(req, res) {
        findHistoriasBySprint(req.params.id, function (historias) {
            return res.json(historias);
        })
    };

    createHistoria = function (data, callback) {
        var historia = new Historia({
            nombre: data.nombre,
            descripcion: data.descripcion,
            prioridad:data.prioridad,
            tamanio:data.tamanio,
            sprint:data.sprint != undefined ? mongoose.Types.ObjectId(data.sprint) : null,
            proyecto: mongoose.Types.ObjectId(data.proyecto),
            terminada:false,
            revisada:false
        });

        historia.save(function (err) {
            if(err){
                callback("error");
            } else {
                callback("historia-saved");
            }
        })
    };

    createHistoriaRequest = function (req, res) {
        createHistoria(req.body, function (json) {
            return res.json(json);
        })
    };

    asignarSprint =function (req, res) {
        console.log("req.body");
        console.log(req.body);
        Historia.findByIdAndUpdate({"_id": mongoose.Types.ObjectId(req.body.id)}, { $set: { "sprint": mongoose.Types.ObjectId(req.body.idSprint) }}, { new: true }, function (err, historia) {
            if (err) {
                return res.json("error", err);
            } else {
                return res.json(historia);
            }
        });
    };

    terminarHistoria =function (req, res) {
        Historia.findByIdAndUpdate({"_id": mongoose.Types.ObjectId(req.body.id)}, { $set: { "terminada": true}}, { new: true }, function (err, historia) {
            if (err) {
                return res.json("error", err);
            } else {
                return res.json(historia);
            }
        });
    };

    retornarHistoria =function (req, res) {
        Historia.findByIdAndUpdate({"_id": mongoose.Types.ObjectId(req.body.id)}, { $set: { "terminada": false }}, { new: true }, function (err, historia) {
            if (err) {
                return res.json("error", err);
            } else {
                return res.json(historia);
            }
        });
    };

    marcarComoTerminada =function (req, res) {
        Historia.findByIdAndUpdate({"_id": mongoose.Types.ObjectId(req.body.id)}, { $set: { "revisada": true }}, { new: true }, function (err, historia) {
            if (err) {
                return res.json("error", err);
            } else {
                return res.json(historia);
            }
        });
    };

    deleteHistoria = function(req, res) {
        Historia.findById(req.body.id, function(err, historia) {
            historia.remove(function(err) {
                if(!err) {
                    return res.json("ok");
                } else {
                    return res.json("error");
                }
            })
        });
    };

    //Rutas
    app.get('/historias/findBacklog/:id', findBacklogByProyectoRequest);
    app.get('/historias/findBySprint/:id', findHistoriasBySprintRequest);
    app.post('/historias/addHistoria', createHistoriaRequest);
    app.post('/historias/addSprint', asignarSprint);
    app.post('/historias/terminarHistoria', terminarHistoria);
    app.post('/historias/retornarHistoria', retornarHistoria);
    app.post('/historias/marcarCompleta', marcarComoTerminada);
    app.post('/historias/delete-historia', deleteHistoria);

};
