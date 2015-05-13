(function(){


	var luchTime = angular.module('lunchTime', [
		'ui.router',
		'mapa',
		'login',
		'user'
	])
	.config(function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise("/");
		
		$stateProvider
			.state('home', {
				url: "/",
				templateUrl: "views/login.html"
			})
			.state('mapa', {
				url: "/mapa",
				templateUrl: "views/mapa.html",
				params: {'centerLat' : null, 'centerLng' : null, 'nomePrincipal' : null},
				controller: 'MapController'
			})
			.state('user', {
				url: "/user",
				templateUrl: "views/user.html",
				controller: "UserController"
			});
	});
})();

function outaddtogroup(){
	angular.element(document.getElementById('lunchTimeApp')).scope().addtogroup();
}

function fixInfoWindow(){
 	var set = google.maps.InfoWindow.prototype.set;
 	google.maps.InfoWindow.prototype.set = function (key, val) {
		var self = this;
        if(key === "map") {
        	if (!this.anchor) {
        		var link = angular.element("<a class='map-add-group' onclick='outaddtogroup()'>Adicionar ao grupo</a>");
        		var divlist = angular.element(this.content).find("div");
        		var gmrev;
        		for(var i = 0; i < divlist.length; i++) {
        			if(angular.element(divlist[i]).hasClass("gm-rev")) {
        				gmrev = divlist[i];
        				break;
        			}
        		}
                angular.element(gmrev).append(angular.element("<div style='float:right;'></div>").append(link));
        	}
        }
        set.apply(this, arguments);
 	}
}