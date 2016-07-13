var app=angular.module("appSockets", []);

app.controller("testCtrl", function($scope) {
    var socket = io.connect({'forceNew': true});

    $scope.mensajeMamalo ="";
    $scope.obj = new Object();

    $scope.enviarMensajeNuevo = function() {
        console.log("OK");
        socket.emit('mensajeNuevo');
    };

    socket.on('enviarMensajes', function(data){
        $scope.mensajeMamalon = data;
        console.log($scope.mensajeMamalon);
        $scope.$apply();
    });
})
