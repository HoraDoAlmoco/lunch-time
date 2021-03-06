(function(){
	var app = angular.module('mapa', [])
    .directive("listaCard", function(){
		return {
			restrict: "E",
			templateUrl : "views/lista-card.html"
		};
	})
	.directive("listaPrincipal", function(){
		return {
			restrict: "E",
			templateUrl : "views/lista-principal.html"
		};
	})
	.directive("setOnClick", function($compile){
	  return {
	    restrict: "A",
	    link: function(scope, elm, attrs, ctrl)
	    {
	      elm.attr("ng-click", "addtogroup()");
	      elm.removeAttr("set-on-click");
	      $compile(elm)(scope);
	    }
	  };
	})
	.controller('MapController', 
			['$scope', '$state', '$stateParams', '$document', '$http', 
	        function($scope, $state, $stateParams, $document, $http){
		
		$scope.meusdados = function (){
			$state.go("user", {});
		}
		
		var noPoi = [
	 	{
	 	    featureType: "poi",
	 	    stylers: [
	 	      { visibility: "off" }
	 	    ]   
	 	  }
	 	];
		         	
	 	var mapOptions = {
	 		center: new google.maps.LatLng($stateParams.centerLat, $stateParams.centerLng),
	 		zoom: 17,
	 		mapTypeId: google.maps.MapTypeId.ROADMAP,
	 		mapTypeControl: false,
	 		streetViewControl: true,
	 		disableDefaultUI: true
	 	};
	 	
	 	$scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	 	
	 	var primarker = new google.maps.Marker({
	        map: $scope.map,
	        position: new google.maps.LatLng($stateParams.centerLat, $stateParams.centerLng),
	        title: $stateParams.nome,
	        icon : "/lunchtime/img/localprincipal.png"
	    });
	 	
	 	google.maps.event.addListener(primarker, 'click', function(){
				$scope.infowindow.setContent("<span>Grupo: " + $stateParams.nome + "</span>");
				$scope.infowindow.open($scope.map, primarker);
	    });
	 	
	 	
	 	$scope.markers = [];
	 	
	 	$scope.infowindow = new google.maps.InfoWindow();
	 	
	 	
		$http.get("/lunchtime/locais.json").success(function(data, status, headers, config) {
			for (i = 0; i < data.locais.length; i++){
		    	local = data.locais[i];
		    	var info = {};
		    	info.titulo = local.titulo;
		    	info.endereco = local.endereco;
		    	info.latitude = local.latitude;
		    	info.longitude = local.longitude;
		    	var infos = local.infos
		    	info.extra = local.categoria;
		    	info.categoria = local.categoria;
		    	for (j = 0; j < infos.length; j++){
		    		info.extra += ", " + infos[j];
		    	}
		    	info.extra += " - " + local.valor;
		    	info.votos = local.votos[0] + " " + local.votos[1];
		    	info.votado = local.votado;
		    	
		        createMarker(info);
		    }
		});
	 	
	 	var createMarker = function(info){
	 		
	 		var eixox = 1;
	 		var eixoy = 136;
	 		if(Number(info.votos[0]) > 1){
	 			eixox = (Number(info.votos[0]) - 1) * 35 + 1;
	 		}
	 		if(info.votado != "") {
	 			eixoy = 92;
	 		}
	 		
	 		var icon;
	 		
	 		if(Number(info.votos[0]) > 0){
	 			icon = new google.maps.MarkerImage("/lunchtime/img/mappin-sprite.png", new google.maps.Size(33, 42), new google.maps.Point(eixox, eixoy));
	 		} else {
	 			icon = new google.maps.MarkerImage("/lunchtime/img/mappin-blank.png", new google.maps.Size(33, 42));
	 		}
	 		
	 		var marker = new google.maps.Marker({
	            map: $scope.map,
	            position: new google.maps.LatLng(info.latitude, info.longitude),
	            title: info.titulo,
	            icon : icon,
	 			animation : google.maps.Animation.DROP
	        });
	 		
	 		marker.titulo = info.titulo;
	 		marker.categoria = info.categoria;
	 		marker.endereco = info.endereco;
	 		marker.extra = info.extra;
	 		marker.votos = info.votos;
	 		marker.votado = info.votado;
	 		marker.quantidade = info.votos[0];
	 		marker.ltmarker = true;
	 		
	 		marker.content = "<div class='card'>" +
							"<div class='card-marker-icon " + info.categoria + "'></div>" +
							"<div class='card-text-wrapper'>" +
								"<div class='main-text card-text-truncate-and-wrap'>" + info.titulo + "</div>" +
								"<div class='address-text card-text-truncate-and-wrap'>" + info.endereco + "</div>" +
								"<div class='info-text card-text-truncate-and-wrap'>" + info.extra + "</div>" +
							"</div>" +
							"<div class='card-info'>" +
								"<div class='card-info-text'>" +
									"<a>" + info.votos + "</a>" +
								"</div>" +
								"<div class='card-info-vote " + info.votado + "'></div>" +
							"</div>" +
						"</div>";
	 		
	 		google.maps.event.addListener(marker, 'click', function(){
	 			$scope.infowindow.setContent(marker.content);
	 			$scope.infowindow.open($scope.map, marker);
	        });
	        
	        $scope.markers.push(marker);
	
	 	}
	
	    
	    $scope.filtroLocais = function(item){
	    	return Number(item.quantidade) > 0;
	    }
	    
	    $scope.openInfoWindow = function(e, selectedMarker){
	        e.preventDefault();
	        google.maps.event.trigger(selectedMarker, 'click');
	    }
	 	
	 	$scope.coreToolBar = "red";
	 	
	 	$scope.iconMenuClass = "close";
	 	$scope.menuClass = "close";
	 	$scope.iconSearchClass = "close";
	 	
	 	$scope.iconSearchBackClass = "disable";
	 	$scope.coresearchlist = "disable";
	 	
	 	$scope.dummyDiv = "disable";
	 	
	 	$scope.iconMenuClass = "enable";
	 	$scope.iconMenuClass = "close";
	 	
	 	$scope.title = "LunchTime"
	 	$scope.coreTitle = "title-default";
	 	
	 	$scope.menushow = function(){
	 		
	 		if($scope.iconMenuClass == "close") {
	 			$scope.iconMenuClass = "openmenu";
	 	 	 	$scope.menuClass = "open";
	 	 	 	$scope.iconSearchClass = "disable";
	 	 	 	$scope.dummyDiv = "enable";
	 	 	 	$scope.title = "Menu"
	 		} else {
	 			$scope.iconMenuClass = "close";
	 	 	 	$scope.menuClass = "close";
	 	 	 	$scope.iconSearchClass = "enable";
	 	 	 	$scope.dummyDiv = "disable";
	 	 	 	$scope.title = "LunchTime";
	 		}
	 	}
	 	
	 	$scope.searchshow = function(){
	 		if($scope.iconSearchBackClass == "disable") {
	 			$scope.dummyDiv = "enable";
	 			$scope.iconMenuClass = "disable";
	 	 	 	$scope.iconSearchBackClass = "enable";
	 	 	 	$scope.iconSearchInputClass = "enable";
	 	 	 	$scope.iconSearchClass = "disable";
	 	 	 	$scope.title = "";
	 	 	 	$scope.coreToolBar = "white";
	 	 	 	$scope.coreTitle = "title-search";
	 	 	 	if($scope.searchtext) {
	 	 	 		$scope.searchtext.titulo = "";
	 	 	 	}
	 		} else {
	 			$scope.dummyDiv = "disable";
	 			$scope.iconSearchBackClass = "disable";
	 	 	 	$scope.iconSearchClass = "enable";
	 	 	 	$scope.iconSearchInputClass = "disable";
	 	 	 	$scope.iconMenuClass = "enable";
	 	 	 	$scope.iconMenuClass = "close";
	 	 	 	$scope.title = "LunchTime";
	 	 	 	$scope.coreToolBar = "red";
	 	 	 	$scope.coreTitle = "title-default";
	 	 	 	$scope.coresearchlist = "disable";
	 		}
	 	}
	 	
	 	$scope.changesearch = function(){
	 		if($scope.searchtext.titulo != ""){
	 			$scope.coresearchlist = "enable";
	 		} else {
	 			$scope.coresearchlist = "disable";
	 		}
	 		
	 	}
	 	
	 	google.maps.event.addListener($scope.map, 'mousedown', function (e) {
	 		$scope.mousedownx = e.pixel.x;
	 		$scope.mousedowny = e.pixel.y;
	 		$scope.mousedownstart = new Date().getTime();
	 	});
	 	
	 	google.maps.event.addListener($scope.map, 'mouseup', function (e) {
	 		if(e.pixel.x == $scope.mousedownx && e.pixel.y == $scope.mousedowny){
	 			var dif = new Date().getTime() - $scope.mousedownstart;
	 			//300ms
	 			if(dif > 300) {
	 				console.log(e.latLng.k + " " + e.latLng.D);
	 			}
	 		}
	 	});
	 	
	 	$scope.addtogroup = function(){
	 		console.log("link clicked");
	 	}
	 	
	}])
})();