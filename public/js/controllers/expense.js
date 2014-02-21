angular.module('ed.budgetbud').controller('ExpenseCtrl',['$scope','Category','Expense','$routeParams','$location','$route','$q',
	function($scope, Category, Expense, $params, $location, $route, $q){

	var cats = $q.defer();
	$scope.categories = Category.query(function(){
		cats.resolve();
	});
	$params.date = $params.date ? $params.date : new Date().getTime();
	var now = $params.date ? new Date(parseInt($params.date,10)) : new Date();
	

	// Build Archive quick links
	$scope.data = {};
	$scope.data.year = [];
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

	if (now <= $scope.data.current.end && now >= $scope.data.current.start)
		now = new Date();

	$params.startDate = $scope.data.current.start;
	$params.endDate = $scope.data.current.end;
	var buds = $q.defer();
	$scope.expenses = Expense.query($params, function(){
		buds.resolve();
	});

	$q.all([cats.promise, buds.promise]).then(function(){
		angular.forEach($scope.expenses, function(b){
			angular.forEach($scope.categories, function(c){
				if (b.category === c.id)
					b.cat = c;
			});
		});
	});

	$scope.changeMonth = function(month) {
		$location.search({'date': month.start, 'startDate': month.start, 'endDate': month.end});
		$route.reload();
	};

	$scope.totalSpent = function() {
		var total = 0;
		for (var i = $scope.expenses.length - 1; i >= 0; i--) {
			total += $scope.expenses[i].amount;
		};
		return total;
	};

	$scope.deleteExpense = function(exp) {
		exp.$delete(function(){
			$scope.expenses.splice($scope.expenses.indexOf(exp),1);
		});
	};

	$scope.saveExpense = function(exp) {
		if (exp.category.id) {
			exp.category = exp.category.id;
			finish(exp);
		} else {
			// Create category on the fly
			Category.save({'title':exp.category}, function(cat){
				exp.category = cat.id;
				$scope.categories.push(cat);
				finish(exp);
			});
		}

		function finish(b) {
			b.date = now.getTime();
			Expense.save(b, function(ex){
				ex.spent = 0;
				$scope.expenses.push(ex);
				$scope.data.newExpense = null;
			});
			
		}
	};

}]);