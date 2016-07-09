var app = angular.module('app', []);

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
