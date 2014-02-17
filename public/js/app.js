

// Declare app level module which depends on filters, and services
angular.module('ed.budgetbud', ['ngRoute','ngResource','ngTouch','ngAnimate']).
  config(['$locationProvider','$routeProvider', function($locationProvider,$route) {

  	var resolve = {
  		user: function(User) {
  			return 
  		}
  	}

    $locationProvider.html5Mode(true);
    $route.when('/',{
    	template:'<div>Overview</div>'
    })
    .when('/budgets',{
    	template:'<div>Budgets</div>'
    })
    .when('/expenses', {
    	template:'<div>Expenses</div>'
    })
    .when('/login',{
    	templateUrl:'/partials/login',
    	controller: 'LoginCtrl'
    })
}])

.factory('Nav', [function(){
	var nav = {};
	nav.open = false; // Show/hide nav
	return nav;
}])

.factory('User',['$q','$http','$window','$location',
	function($q, $http, $window, $location){

	var user = {};

	// Log In
	user.login = function(credentials) {
		var defer = $q.defer();
		$http.post('/api/users/login', credentials).success(function(data){
			user.user = data;
			$window.sessionStorage['ed.budgetbud.user'] = angular.toJson(data);
			defer.resolve(data);
		}).error(function(err){
			defer.reject(err);
		});
		return defer.promise;
	};

	user.create = function(credentials) {
		var defer = $q.defer();
		$http.post('/api/users', credentials).success(function(data){
			user.user = data;
			$window.sessionStorage['ed.budgetbud.user'] = angular.toJson(data);
			defer.resolve(data);
		}).error(function(err){
			defer.reject(err);
		});
		return defer.promise;
	}

	user.loggedIn = function() {
		if ($window.sessionStorage['ed.budgetbud.user'])
			user.user = angular.fromJson($window.sessionStorage['ed.budgetbud.user']);
		return angular.isDefined(user.user);
	};

	user.logout = function() {
		delete $window.sessionStorage['ed.budgetbud.user'];
		$http.get('/api/users/logout').success(function(data){
			delete user.user;
			$location.path('/login');
		});
	}

	return user;

}])

.controller('NavCtrl', ['$scope','Nav','User','$location', function($scope,Nav,User,$location){
	$scope.nav = Nav;
	$scope.loggedIn = User.loggedIn;
	$scope.logout = User.logout;

	$scope.$on('$routeChangeStart', function(e, route){
		if (route.$$route.originalPath !== '/login' && !User.loggedIn())
			$location.path('/login');
	})
}])

.run(['$rootScope','$location','Nav',function($root,$loc){
	$root.location = $loc;
}]);