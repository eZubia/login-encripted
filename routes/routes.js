
module.exports = function(app, mongoose) {
  var Usuario = require('./../models/usuarios').Usuario;

  registerUser = function(req, res) {
    res.render("registrar");
  };

  postUser = function(req, res) {
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
  };

    postUserMovil = function(req, res) {
    var usuarioNuevo = new Usuario({
      nombre: req.body.nombre,
      paterno: req.body.paterno,
      materno: req.body.materno,
      email: req.body.email
    });
    usuarioNuevo.generateHash(req.body.password);
    usuarioNuevo.save(function (err) {
        if (err) {
            res.json("error");
        }
        return res.json("ok");

    });
  };

  loginUser = function(req, res) {
    Usuario.findOne({'email': req.body.email})
    .exec(function(err, usuario){
      if(usuario !== null && usuario.validPassword(req.body.password)) {
        return res.json("connected");
      } else {
        return res.json("no-sesion");
      }
    });
  };

  webService = function(req, res) {
      console.log("req.params.email");
      console.log(req.params.email);
      console.log("req.params.password");
      console.log(req.params.password);
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
  app.get('/registrar', registerUser);
  app.post('/registrar', postUser);
  app.post('/registrar/movil', postUserMovil);
  app.post('/login', loginUser);
  app.get('/webservice/:email/:password', webService);

}
