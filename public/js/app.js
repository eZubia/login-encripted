var app = angular.module('appTask', []);

app.controller('taksController', ['$scope', '$http', function ($scope, $http) {

    var socket = io.connect({'forceNew': true});
    $scope.pendientes = [];
    $scope.nuevoPendiente = new Object();

    socket.on('recargarPendientes', function (data) {
        $scope.recargarPendientes();
        $scope.$apply();
    });


    $scope.deletePendiente = function(idPendiente){
      console.log(idPendiente);
      socket.emit('deletePendiente', idPendiente);
    }

    $scope.init = function(idUsuario, pendientes){
      $scope.idUsuario = idUsuario;
      $scope.recargarPendientes();
    };

    $scope.recargarPendientes = function(){
      $http.get('/todos/user/'+$scope.idUsuario).success(function(data) {
            $scope.pendientes = data;
            console.log(data);
        }).error(function(data){
          //TODO:Error
          });
    };

    $scope.sendPendiente = function() {
      console.log("AAA");
      $scope.nuevoPendiente.idUsuario = $scope.idUsuario;
      socket.emit('crearNuevoPendiente', $scope.nuevoPendiente);
    };

    $scope.terminarPendiente = function(idPendiente){
      console.log(idPendiente);
      socket.emit('terminarPendiente', idPendiente);
    }

}]);
