
exports.load = function(app) {
	var mongo = require('mongodb');
	app.post('/api/users', create(app, mongo));
	app.post('/api/users/login', login(app,mongo));
	app.get('/api/users/logout', app.get('auth'), logout(app,mongo));
	app.get('/api/users', app.get('auth'), query(app,mongo));
};

function logout(app,mongo) {
	return function(req,res) {
		req.session.destroy();
		res.json({'msg':'ok'});
	}
}

function create(app, mongo) {
	// Add User
	return function(req, res) {
		mongo.MongoClient.connect(app.get('dbstring'), function(err, db){
			var user = db.collection('user');
			user.find({email: req.body.email}).toArray(function(err,docs){
				if (docs.length > 0) {
					res.status(400).json({'error': 'Email address is taken'});
					return;
				}

				// Todo, HASH and SALT
				user.insert(req.body, function(err){
					if (err) {
						res.json({'error':'could not insert'});
						return;
					}

					req.session.regenerate(function(err){
						req.session.user = req.body;
						req.session.userid = req.body.email;
						res.json(req.body);
						return;
					});
				});
			});
		});
	};
}

function login(app, mongo) {
	return function(req, res) {
		mongo.MongoClient.connect(app.get('dbstring'), function(err,db){
			var user = db.collection('user');
			user.findOne({email:req.body.email,password:req.body.password}, function(err, item){
				if (err || !item) {
					res.status(401).json({'error':'Email or password incorrect'});
					return;
				}

				req.session.regenerate(function(err){
					req.session.user = item;
					req.session.userid = item.email;
					res.json(item);
					return;
				});
			});
		});
	}
}

function query(app, mongo) {

	// Get posts
	return function(req, res) {
		mongo.MongoClient.connect(app.get('dbstring'), function(err, db) {
			var post = db.collection('user');

			post.find().toArray(function(err, docs){
				if (err)
					return console.error(err);

				res.json(docs);
			});
		});
	};
}