var app = angular.module('appTask', []);

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
    };

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

    $scope.crearNuevoPendiente = function() {
      socket.emit('crearNuevoPendiente', $scope.nuevoPendiente);
    };

    $scope.sendPendiente = function() {
      console.log("AAA");
      $scope.nuevoPendiente.idUsuario = $scope.idUsuario;
      socket.emit('crearNuevoPendiente', $scope.nuevoPendiente);
    };
}]);
