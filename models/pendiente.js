var mongoose = require('mongoose');
var tarea = mongoose.Schema;

var pendienteSchema = new tarea({
	descripcion: { type: String },
	fecha:  { type: String },
	prioridad: { type: String },
	terminada: { type: Boolean }
});


module.exports = mongoose.model('Pendiente', pendienteSchema);
