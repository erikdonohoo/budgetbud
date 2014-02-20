exports.load = function(app) {
	var mongo = require('mongodb');
	app.get('/api/budgets', app.get('auth'), query(app,mongo));
	app.post('/api/budgets', app.get('auth'), save(app,mongo));
};

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

			budget.find(req.query).sort({'total':-1}).toArray(function(err, docs){
				res.json(docs);
			});
		});
	};
}

function save(app, mongo) {
	return function(req, res) {
		mongo.MongoClient.connect(app.get('dbstring'), function(err,db){
			var budget = db.collection('budget');
			req.body.user = req.session.user.email;
			budget.insert(req.body, function(err){
				res.json(req.body);
			})
		})
	};
}