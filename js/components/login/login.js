(function(){
	var app = angular.module('login', [])
	.controller('LoginController', 
			['$scope', '$state', '$http', '$rootScope', 
			 function ($scope, $state, $http, $rootScope) {
		$scope.formData = {};
		$scope.processLogin = function (){
			//alert($scope.pass + " " + $scope.login);
			//https://api.mongolab.com/api/1/databases/ltdb/collections/users?apiKey=YXgR-q92vuVCKlSm-ji3nplDTE7rHIQh
			///lunchtime/local-principal.json
			$http.get("https://api.mongolab.com/api/1/databases/ltdb/collections/users?apiKey=YXgR-q92vuVCKlSm-ji3nplDTE7rHIQh").success(function(data, status, headers, config) {
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