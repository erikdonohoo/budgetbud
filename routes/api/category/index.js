exports.load = function(app) {
	var mongo = require('mongodb');
	app.get('/api/categories', app.get('auth'), query(app,mongo));
};

function query(app,mongo) {
	return function(req, res) {
		mongo.MongoClient.connect(app.get('dbstring'), function(err,db){
			var budget = db.collection('category');
			
			req.query = req.query || {};
			req.query.user = req.session.user.email;
			budget.find(req.query).sort({'total':-1}).toArray(function(err, docs){
				res.json(docs);
			});
		});
	};
}