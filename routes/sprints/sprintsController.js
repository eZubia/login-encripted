/**
 * Created by erikzubia on 5/28/17.
 */
/**
 * Created by erikzubia on 5/28/17.
 */

module.exports = function(app, mongoose) {
    var Sprint = require('./../../models/sprint');
    var Historia = require('./../../models/historia');

    findSprintByProyecto= function(id, callback) {
        Sprint.find({"proyecto":mongoose.Types.ObjectId(id)})
            .select({"proyecto":0})
            .exec(function(err, sprints){
                if(err) {
                    callback("error")
                } else {
                    callback(sprints);
                }
            });
    };

    findSprintByProyectoRequest= function(req, res) {
        findSprintByProyecto(req.params.id, function (historias) {
            return res.json(historias);
        })
    };


    createSprint = function (data, callback) {
        var sprint = new Sprint({
            finalizo: false,
            nombreSprint: data.nombreSprint,
            descripcionSprint:data.descripcionSprint,
            proyecto: mongoose.Types.ObjectId(data.proyecto)
        });

        sprint.save(function (err) {
            if(err){
                callback("error");
            } else {
                callback("sprint-saved");
            }
        })
    };

    createSprintRequest = function (req, res) {
        createSprint(req.body, function (json) {
            return res.json(json);
        })
    };


    terminarSprint = function (req, res) {
        Historia.find({"sprint": mongoose.Types.ObjectId(req.body.id)})
            .exec(function (err, historias) {
                var canFinish = true;
                if(historias.length > 0){
                    historias.forEach(function (historia) {
                       canFinish = canFinish && historia.terminada && historia.revisada;
                    });
                }
                if(canFinish){
                    Sprint.findByIdAndUpdate({"_id": mongoose.Types.ObjectId(req.body.id)}, { $set: { "finalizo": true}}, { new: true }, function (err, sprint) {
                        if (err) {
                            return res.json("error", err);
                        } else {
                            return res.json("is-finish");
                        }
                    });
                } else {
                    return res.json("cant-finish");
                }
            });
    };


    deleteSprint = function(req, res) {
        Historia.find({"sprint": mongoose.Types.ObjectId(req.body.id)})
            .exec(function (err, historias) {
               if(historias.length >0){
                   return res.json("cant-delete");
               } else {
                Sprint.findById(req.body.id, function(err, sprint) {
                    sprint.remove(function(err) {
                        if(!err) {
                            return res.json("ok");
                        } else {
                            return res.json("error");
                        }
                    })
                });
               }
            });
    };

    //Rutas
    app.get('/sprint/findByProyecto/:id', findSprintByProyectoRequest);
    app.post('/sprint/addSprint', createSprintRequest);
    app.post('/sprint/terminarSprint', terminarSprint);
    app.post('/sprint/deleteSprint', deleteSprint);

};
