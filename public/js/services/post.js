angular.module('ed.web').factory('Post', ['$resource', function($res){
	return $res('/api/posts/:_id',{_id:'@_id'});
}]);