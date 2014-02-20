angular.module('ed.budgetbud').controller('BudgetCtrl', ['$scope','Budget','$routeParams','$timeout','Category','$route','$location',
	function($scope, Budget, $params,$timeout, Category, $route, $location){

	$scope.categories = [];
	Category.query().then(function(cats){
		$scope.categories = cats;
	});

	$scope.data = {};
	$scope.data.year = [];
	var now = $params.month ? new Date(parseInt($params.month)) : new Date();

	// Build Archive quick links
	for (var i = 0; i < 12; i++) {
		var month = {};
		month.start = new Date(now.getFullYear(), now.getMonth() - (6 - i), 1).getTime();
		month.end = new Date(now.getFullYear(), now.getMonth() - (6 - i) + 1, 0).getTime();
		if (i === 6) {
			month.current = true;
			$scope.data.current = month;
		}

		$scope.data.year.push(month);
	}

	// Set query params if none were given
	if (!$params.startDate)
		angular.extend($params, {'startDate': $scope.data.current.start, 'endDate': $scope.data.current.end})

	// Get budgets
	Budget.query($params).then(function(budgets){
		$scope.budgets = budgets;
		setUpBudgets();
		$timeout(animateBudgets);
	});

	$scope.saveBudget = function(budget) {
		budget.category = budget.category._id;
		budget.date = $scope.data.current.start;
		Budget.save(budget);
		$scope.budgets.push(budget);
		setUpBudgets();
		$timeout(function(){
			animateBudgets(budget);
		});
		$scope.data.newBudget = null;
	};

	// Change budget month
	$scope.viewBudget = function(month) {
		$location.search({'month': month.start, 'startDate': month.start, 'endDate': month.end});
		$route.reload();
	};

	// Set values on budgets
	function setUpBudgets() {
		for (var i = $scope.budgets.length - 1; i >= 0; i--) {
			var b = $scope.budgets[i];
			b.spent = Math.floor(Math.random() * b.total);
			if (i === 1)
				b.spent = 0;
			if (i === 2)
				b.spent = 1000;
			b.total = Math.floor(b.total);
		}
	}

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