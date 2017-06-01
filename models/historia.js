var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Proyecto = mongoose.model('Proyecto');
var Sprint = mongoose.model('Sprint');

var historiaUsuarioSchema = new Schema({
    nombre:{type:String, required:true},
    descripcion:{type:String, required:true},
    prioridad:{type:Number, required:true},
    tamanio:{type:Number, required:true},
    sprint:{type: Schema.ObjectId, ref: "Sprint"},
    proyecto:{type: Schema.ObjectId, ref: "Proyecto", required: true},
    desarrollador:{type: Schema.ObjectId, ref:"Usuario"},
    terminada:{type: Boolean, required:true},
    revisada:{type: Boolean, required:true}
});

var HistoriaUsuario = mongoose.model("HistoriaUsuario", historiaUsuarioSchema);
module.exports = HistoriaUsuario;
