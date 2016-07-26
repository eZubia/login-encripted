var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Usuario = mongoose.model('Usuario');

var pendienteSchema = new Schema({
	descripcion: { type: String },
	fecha:  { type: String },
	prioridad: { type: Number },
	terminada: { type: Boolean },
	usuario: {type: Schema.ObjectId, ref: "Usuario"}
});


module.exports = mongoose.model('Pendiente', pendienteSchema);
