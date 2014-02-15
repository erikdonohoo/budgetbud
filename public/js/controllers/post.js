angular.module('ed.web').controller('PostCtrl', ['$scope','Nav','$routeParams','Post',
	function($scope, Nav, $params, Post){

	Nav.open = false;

	Post.get({_id:$params.blogid}, function(post){
		$scope.post = post;
	});

	$scope.postLoading = function() {
		return !angular.isDefined($scope.post);
	};

	var data = {};
	data.id = $params.blogid;

	$scope.data = data;
}]);