var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var usuarioSchema = new Schema({
  nombre: {type:String, required:"El nombre es Obligatorio"},
  paterno: {type:String, required:true},
  materno: {type:String, required:true},
  email:{type:String, required:true},
  password:{type:String}
});

usuarioSchema.virtual("confirmarPassword").get(function(){
  return this.otroPassword;
}).set(function(password){
  this.otroPassword = password;
});

usuarioSchema.methods.generateHash = function (password) {
    this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

usuarioSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

var Usuario = mongoose.model("Usuario", usuarioSchema);
module.exports.Usuario = Usuario;
