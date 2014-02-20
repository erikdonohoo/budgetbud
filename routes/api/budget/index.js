exports.load = function(app) {
	var mongo = require('mongodb');
	app.get('/api/budgets', app.get('auth'), query(app,mongo));
	app.post('/api/budgets', app.get('auth'), save(app,mongo));
	app.delete('/api/budgets/:id', app.get('auth'), remove(app,mongo));
};

function remove(app,mongo) {
	return function(req, res) {
		mongo.MongoClient.connect(app.get('dbstring'), function(err,db){
			var budget = db.collection('budget');
			budget.remove({'id':req.params.id},true,function(err){
				res.json({'msg':'ok'});
			});
		});
	};
}

function query(app,mongo) {
	return function(req, res) {
		mongo.MongoClient.connect(app.get('dbstring'), function(err,db){
			var budget = db.collection('budget');
			var expense = db.collection('expense');

			req.query = req.query || {};
			req.query.user = req.session.user.email;

			// Handle month requests
			if (req.query.month) {
				delete req.query.month;
			}

			if (req.query.startDate) {
				var date = {'$gte': parseInt(req.query.startDate,10)};
				req.query.date = date;
				delete req.query.startDate;
			}

			if (req.query.endDate) {
				req.query.date = req.query.date || {};
				req.query.date['$lte'] = parseInt(req.query.endDate,10);
				delete req.query.endDate;
			}

			budget.find(req.query).sort({'total':-1}).toArray(function(err, budgets){

				// Find total spent in each category
				var q = {};
				q.date = req.query.date;
				expense.find(q).toArray(function(err, expenses){
					// OPTIMIZE
					for (var i = expenses.length - 1; i >= 0; i--) {
						var exp = expenses[i];

						for (var j = budgets.length - 1; j >= 0; j--) {
							var budget = budgets[j];
							budget.spent = budget.spent ? budget.spent + exp.amount : 0;
						}
					}

					res.json(budgets);
				});
			});
		});
	};
}

function save(app, mongo) {
	var uuid = require('node-uuid');
	return function(req, res) {
		mongo.MongoClient.connect(app.get('dbstring'), function(err,db){
			var budget = db.collection('budget');
			req.body.user = req.session.user.email;
			req.body.id = uuid.v4();
			req.body.date = req.body.date ? req.body.date : new Date().getTime();
			budget.insert(req.body, function(err){
				res.json(req.body);
			});
		});
	};
}