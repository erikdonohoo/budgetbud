angular.module('ed.budgetbud').controller('BudgetCtrl', ['$scope','Budget','$routeParams','$timeout','Category',
	function($scope, Budget, $params,$timeout,Category){

	Budget.query($params).then(function(budgets){
		$scope.budgets = budgets;
		for (var i = $scope.budgets.length - 1; i >= 0; i--) {
			var b = $scope.budgets[i];
			b.spent = Math.floor(Math.random() * b.total);
			if (i === 1)
				b.spent = 0;
			if (i === 2)
				b.spent = 1000;
			b.total = Math.floor(b.total);
		}
		$timeout(animateBudgets);
	});

	$scope.categories = [];
	Category.query().then(function(cats){
		$scope.categories = cats;
	});

	$scope.data = {};

	// Animate and fix budget boxes
	function animateBudgets(budget) {

		var radius = {'border-top-left-radius':'inherit','border-bottom-left-radius':'inherit'};
		function calcVal(b) {
			var val = Math.floor((1 - (b.spent/b.total)) * 100);
			val = val >= 100 ? 100 : (val <= 0 ? 0 : val);
			return val;
		}

		if (budget) {
			var num = calcVal(budget);
			budget.style = {'width': num + '%'};
			if (num === 100)
				angular.extend(budget.style, radius);

			return;
		}

		for (var i = 0; i < $scope.budgets.length; i++) {
			var b = $scope.budgets[i];
			var n = calcVal(b);
			b.style = {'width': n + '%'};
			if (n === 100)
				angular.extend(b.style, radius);
		}
	}

}]);