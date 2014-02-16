

// Declare app level module which depends on filters, and services
angular.module('ed.budgetbud', ['ngRoute','ngResource','ngTouch','ngAnimate']).
  config(['$locationProvider','$routeProvider', function($locationProvider,$route) {
    $locationProvider.html5Mode(true);
}])

.factory('Nav', [function(){
	var nav = {};
	nav.open = false; // Show/hide nav
	return nav;
}])

.controller('NavCtrl', ['$scope','Nav', function($scope,Nav){
	$scope.nav = Nav;
}])

.run(['$rootScope','$location','Nav',function($root,$loc){
	$root.location = $loc;
}]);