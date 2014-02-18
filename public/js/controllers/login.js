angular.module("ed.budgetbud").controller('LoginCtrl', ['$scope','User','$location','$http',
    function($scope, User, $location, $http) {

    $scope.data = {};
    $scope.data.user = {};
    $scope.handle = function() {
        if (!$scope.data.create) {
            User.login($scope.data.user).then(function(user){
                $location.path('/');
            });
        } else {
            User.create($scope.data.user).then(function(user){
                $location.path('/');
            });
        }
    }
}]);