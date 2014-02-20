exports.load = function(app) {
	var mongo = require('mongodb');
	app.get('/api/categories', app.get('auth'), query(app,mongo));
	app.post('/api/categories', app.get('auth'), save(app,mongo));
};

function save(app,mongo) {
	var uuid = require('node-uuid');
	return function(req, res) {
		mongo.MongoClient.connect(app.get('dbstring'), function(err,db){
			var category = db.collection('category');
			req.body.user = req.session.user.email;
			req.body.id = uuid.v4();
			category.insert(req.body, function(err){
				res.json(req.body);
			});
		});
	};
}

function query(app,mongo) {
	return function(req, res) {
		mongo.MongoClient.connect(app.get('dbstring'), function(err,db){
			var category = db.collection('category');
			
			req.query = req.query || {};
			req.query.user = req.session.user.email;
			category.find(req.query).sort({'total':-1}).toArray(function(err, docs){
				res.json(docs);
			});
		});
	};
}