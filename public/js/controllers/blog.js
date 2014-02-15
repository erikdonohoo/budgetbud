angular.module('ed.web').controller('BlogCtrl', ['$scope','Nav','$routeParams','Post','$location','$route',
	function($scope, Nav, $params, Post, $location, $route){

	Nav.open = false;
	var year = [],
		now = new Date(),
		data = {};

	// Build Archive quick links
	for (var i = 0; i < 12; i++) {
		var month = {};
		month.start = new Date(now.getFullYear(), now.getMonth() - i, 1).getTime();
		month.end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0).getTime();
		year.push(month);
	}

	function searchPosts(params) {
		$scope.posts = undefined;
		Post.query(params, function(posts){
			$scope.posts = posts;
		});
	}

	if ($params.tag)
		data.tag = $params.tag;

	$scope.postsLoading = function() {
		return !angular.isDefined($scope.posts);
	};

	// Search for posts
	$scope.search = function() {
		$location.search({'search':$scope.data.search});
		$route.reload();
	}

	searchPosts($params || {});

	$scope.year = year;
	$scope.data = data;
	$scope.today = now.getTime();
}]);