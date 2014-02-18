angular.module('ed.budgetbud').controller('BudgetCtrl', ['$scope','Budget','$routeParams',
	function($scope, Budget, $params){

	Budget.query($params).then(function(budgets){
		$scope.budgets = budgets;
	});
}]);