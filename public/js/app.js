var app = angular.module('appTask', []);

app.controller('chatController', ['$scope', '$http', function ($scope, $http) {

    var socket = io.connect({'forceNew': true});
    $scope.messages = $scope.messages || [];
    $scope.mensaje = new Object();

    socket.on('sendMessages', function (data) {
        $scope.messages = data.emitted.fulfill[0];
        $scope.$apply();
    });

    socket.on('sendMessage', function (data) {
        $scope.messages.push(data);
        $scope.$apply();
    });
    $scope.enviarMensajeNuevo = function () {
        socket.emit('newMessage', $scope.mensaje);
    }
}]);

app.controller('taksController', ['$scope', '$http', function ($scope, $http) {

    var socket = io.connect({'forceNew': true});
    $scope.pendientes = [];
    $scope.nuevoPendiente = new Object();

    socket.on('sendMessages', function (data) {
        $scope.messages = data.emitted.fulfill[0];
        $scope.$apply();
    });

    socket.on('recargarPendientes', function (data) {
        $scope.recargarPendientes();
        $scope.$apply();
    });

    $scope.nuevoPendientes = function () {
        socket.emit('nuevoPendiente', $scope.nuevoPendiente);
    }

    $scope.init = function(idUsuario, pendientes){
      console.log("Sexo en la playa");
      $scope.idUsuario = idUsuario;
      $scope.recargarPendientes();
    }

    $scope.recargarPendientes = function(){
      $http.get('/todos/user/'+$scope.idUsuario).success(function(data) {
            $scope.pendientes = data;
        }).error(function(data){
          //TODO:Error
          });
    }

    $scope.crearNuevoPendiente = function() {
      socket.emit('crearNuevoPendiente', $scope.nuevoPendiente);
    }
/*
    $scope.sendPost = function() {
      var data = $.param({
        json: JSON.stringify({
          descripcion: $scope.descripcion,
          fecha: $scope.fecha,
          prioridad: $scope.prioridad,
          terminada: $scope.terminada
        });
        $http.post("/", data).succes(function(data, status){
          
        })
      });
    }
    */
}]);
