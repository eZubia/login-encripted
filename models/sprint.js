/**
 * Created by erikzubia on 5/28/17.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Proyecto = mongoose.model('Proyecto');

var sprintSchema = new Schema({
    finalizo:{type:Boolean, required:true},
    nombreSprint:{type:String, required:true},
    descripcionSprint:{type:String, required:true},
    proyecto:{type: Schema.ObjectId, ref: "Proyecto", required: true},
});

var Sprint = mongoose.model("Sprint", sprintSchema);
module.exports = Sprint;
