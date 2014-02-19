exports.load = function(app) {
	var mongo = require('mongodb');
	app.get('/api/budgets', app.get('auth'), query(app,mongo));
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

			budget.find(req.query).sort({'total':-1}).toArray(function(err, docs){
				res.json(docs);
			});
		});
	};
}