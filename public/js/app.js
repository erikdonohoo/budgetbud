

// Declare app level module which depends on filters, and services
angular.module('ed.budgetbud', ['ngRoute','ngResource','ngTouch','ngAnimate']).
  config(['$locationProvider','$routeProvider','$httpProvider', function($locationProvider,$route,$http) {

	$locationProvider.html5Mode(true);
	$route.when('/',{
		templateUrl:'partials/overview',
		controller: 'OverviewCtrl'
	})
	.when('/budgets',{
		templateUrl:'partials/budget',
		controller: 'BudgetCtrl'
	})
	.when('/expenses', {
		template:'<div>Expenses</div>'
	})
	.when('/login',{
		templateUrl:'/partials/login',
		controller: 'LoginCtrl'
	});

	// Handle auth issues
	$http.interceptors.push(['$location','$window', function($location,$window){
		return {
			responseError: function(rejection) {
				if (rejection.status === 401 && rejection.config.url.indexOf('/api') === 0) {
					console.log("Auth Issue, force signout");
					delete $window.sessionStorage['ed.budgetbud.user'];
					$location.path('/login');
				}
			}
		};
	}]);
}])

.factory('Nav', [function(){
	var nav = {};
	nav.open = false; // Show/hide nav
	return nav;
}])

.filter('edMoney', function(){
	return function(num) {
		return parseFloat(Math.round(Math.abs(num.toString()) * 100) / 100).toFixed(2);
	};
})

.factory('Budget', ['$q','$http',
	function($q, $http){

	var budget = {};

	budget.query = function(params) {
		var defer = $q.defer();
		$http.get('/api/budgets', {params:params}).success(function(budgets){
			defer.resolve(budgets);
		}).error(function(err){
			defer.reject(err);
		});
		return defer.promise;
	};

	return budget;
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
	};

	user.query = function() {
		var defer = $q.defer();
		$http.get('/api/users').success(function(users){
			defer.resolve(users);
		}).error(function(err){
			defer.reject(err);
		});
		return defer.promise;
	};

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
	};

	return user;

}])

.controller('NavCtrl', ['$scope','Nav','User','$location', function($scope,Nav,User,$location){
	$scope.nav = Nav;
	$scope.loggedIn = User.loggedIn;
	$scope.logout = User.logout;
	$scope.location = $location;

	$scope.$on('$routeChangeStart', function(e, route){
		if (route.$$route.originalPath !== '/login' && !User.loggedIn())
			$location.path('/login');
	});
}])

.run(['$rootScope','$location','Nav',function($root,$loc){
	$root.location = $loc;
}]);