exports.load = function(app) {
	var mongo = require('mongodb');
	app.get('/api/expenses', app.get('auth'), query(app,mongo));
	app.post('/api/expenses', app.get('auth'), save(app,mongo));
	app.delete('/api/expenses/:id', app.get('auth'), remove(app,mongo));
};

function remove(app,mongo) {
	return function(req, res) {
		mongo.MongoClient.connect(app.get('dbstring'), function(err,db){
			var expense = db.collection('expense');
			expense.remove({'id':req.params.id},true,function(err){
				res.json({'msg':'ok'});
			});
		});
	};
}

function save(app,mongo) {
	var uuid = require('node-uuid');
	return function(req, res) {
		mongo.MongoClient.connect(app.get('dbstring'), function(err,db){
			var expense = db.collection('expense');
			req.body.user = req.session.user.email;
			req.body.id = uuid.v4();
			req.body.date = req.body.date ? req.body.date : new Date().getTime();
			expense.insert(req.body, function(err){
				res.json(req.body);
			});
		});
	};
}

function query(app,mongo) {
	return function(req, res) {
		mongo.MongoClient.connect(app.get('dbstring'), function(err,db){
			var expense = db.collection('expense');
			
			req.query = req.query || {};

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

			req.query.user = req.session.user.email;
			expense.find(req.query).sort({'date':-1}).toArray(function(err, docs){
				res.json(docs);
			});
		});
	};
}