

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

.factory('User',['$q','$http', 
	function($q, $http){

	var user = {};

	// Log In
	user.logIn = function(credentials) {
		var defer = $q.defer();
		$http.post('/api/user/login', credentials).success(function(data){
			user.setUser(data);
			defer.resolve(data);
		}).error(function(err){
			defer.reject(err);
		});
		return defer.promise;
	};

	return user;

}])

.controller('NavCtrl', ['$scope','Nav','User', function($scope,Nav,User){
	$scope.nav = Nav;
	$scope.loggedIn = User.loggedIn
}])

.run(['$rootScope','$location','Nav',function($root,$loc){
	$root.location = $loc;
}]);