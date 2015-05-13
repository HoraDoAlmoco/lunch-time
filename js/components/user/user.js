(function(){
	var app = angular.module('user', [])
	.controller('UserController', 
			['$scope', '$state', '$stateParams', '$document', '$rootScope', 
	        function($scope, $state, $stateParams, $document, $rootScope){
		$scope.title = "Meus dados";
		$scope.coreToolBar = "blue";
		
		$scope.name = "Nome e Sobrenome";
		$scope.login = "login para login :P";
		$scope.email = "email@emailqualquer.com";
		
		$scope.backtomap = function (){
			$state.go("mapa", {
				'centerLat': $rootScope.usuario.grupoPrincipal.latitude,
				'centerLng': $rootScope.usuario.grupoPrincipal.longitude,
				'nomePrincipal' : $rootScope.usuario.grupoPrincipal.nome
			});
		};
		
	}]);
})();