var mongoose = require('mongoose');
var tarea = mongoose.Schema;
var Usuario = mongoose.model('Usuario');

var pendienteSchema = new tarea({
	descripcion: { type: String },
	fecha:  { type: String },
	prioridad: { type: String },
	terminada: { type: Boolean },
	usuario: { type: Schema.ObjectId, ref: "Usuario"}
});


module.exports = mongoose.model('Pendiente', pendienteSchema);
