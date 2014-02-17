angular.module("ed.budgetbud").controller('LoginCtrl', ['$scope','User','$location','$http',
    function($scope, User, $location, $http) {

    $scope.data = {};
    $scope.data.user = {};
    console.log('yeah');
    $scope.handle = function() {
        console.log('handle');
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