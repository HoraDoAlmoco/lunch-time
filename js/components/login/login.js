(function(){
	var app = angular.module('login', [])
	.controller('LoginController', 
			['$scope', '$state', '$http', '$rootScope', 
			 function ($scope, $state, $http, $rootScope) {
		$scope.formData = {};
		$scope.processLogin = function (){
			//alert($scope.pass + " " + $scope.login);
			
			$http.get("/lunchtime/local-principal.json").success(function(data, status, headers, config) {
				$rootScope.usuario = {};
				$rootScope.usuario.grupoPrincipal = {};
				$rootScope.usuario.grupoPrincipal = data;
				
				$state.go("mapa", {
					'centerLat': $rootScope.usuario.grupoPrincipal.latitude,
					'centerLng': $rootScope.usuario.grupoPrincipal.longitude,
					'nomePrincipal' : $rootScope.usuario.grupoPrincipal.nome
				});

			});
		};
	}]);
})();