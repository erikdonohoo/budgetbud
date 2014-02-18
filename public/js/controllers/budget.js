angular.module('ed.budgetbud').controller('BudgetCtrl', ['$scope','Budget','$routeParams','$timeout',
	function($scope, Budget, $params,$timeout){

	Budget.query($params).then(function(budgets){
		$scope.budgets = budgets;
		for (var i = $scope.budgets.length - 1; i >= 0; i--) {
			var b = $scope.budgets[i];
			b.spent = Math.floor(Math.random() * b.total);
		}
		$timeout(animateBudgets);
	});

	function animateBudgets() {
		for (var i = 0; i < $scope.budgets.length; i++) {
			var budget = $scope.budgets[i];
			budget.style = {'width': Math.floor((1 - (budget.spent/budget.total)) * 100) + '%'};
		}
	}

}]);