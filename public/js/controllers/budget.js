angular.module('ed.budgetbud').controller('BudgetCtrl', ['$scope','Budget','$routeParams','$timeout','Category','$route','$location',
	function($scope, Budget, $params,$timeout, Category, $route, $location){

	$scope.categories = [];
	$scope.categories = Category.query();

	$scope.data = {};
	$scope.data.year = [];
	var now = $params.month ? new Date(parseInt($params.month,10)) : new Date();

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
		angular.extend($params, {'startDate': $scope.data.current.start, 'endDate': $scope.data.current.end});

	// Get budgets
	Budget.query($params, function(budgets){
		$scope.budgets = budgets;
		$timeout(animateBudgets);
	});

	$scope.newBudget = function() {
		$scope.data.newBudget = {};
	};

	$scope.deleteBudget = function(budget) {
		budget.$delete(function(){
			$scope.budgets.splice($scope.budgets.indexOf(budget),1);
		});
	};

	$scope.totalBudgets = function() {
		var total;
		for (var i = $scope.budgets.length - 1; i >= 0; i--) {
			total = total || 0;
			var b = $scope.budgets[i];
			total += b.total;
		}
		return total;
	};

	$scope.saveBudget = function(budget) {

		if (budget.category._id) {
			budget.category = budget.category.id;
			finish(budget);
		} else {
			// Create category on the fly
			Category.save({'title':budget.category}, function(cat){
				budget.category = cat.id;
				$scope.categories.push(cat);
				finish(budget);
			});
		}

		function finish(b) {
			b.date = now.getTime();
			Budget.save(b, function(bud){
				bud.spent = 0;
				$scope.budgets.push(bud);
				$timeout(function(){
					animateBudgets(bud);
				});
				$scope.data.newBudget = null;
			});
			
		}
	};

	// Change budget month
	$scope.viewBudget = function(month) {
		$location.search({'month': month.start, 'startDate': month.start, 'endDate': month.end});
		$route.reload();
	};

	// Animate and fix budget boxes
	function animateBudgets(budget) {

		var radius = {'border-top-left-radius':'inherit','border-bottom-left-radius':'inherit'};
		function calcVal(b) {
			b.spent = b.spent ? b.spent : 0;
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