
/**
 * Module dependencies.
 */

var express = require('express'),
	routes = require('./routes');

var app = module.exports = express();

// Configuration
app.set('port', process.env.PORT || 3000);
app.set('dbstring', process.env.MONGOHQ_URL);
app.use(express.bodyParser());
app.use(express.cookieParser('ed.budgetbud'));
app.use(express.session());
app.use(express.methodOverride());
app.use(express.static('public'));
app.use(app.router);

// Middleware for session
app.set('auth', function(req, res, next){

	// Check session
	if (!req.session || !req.sesssion.userid)
		res.status(401).json({'error':'Need to Authenticate'});

	var mongo = require('mongo');
	mongo.MongoClient.connection(app.get('dbstring'), function(err, db){
		var user = db.collection('user');
		user.findOne({_id: new mongo.BSONPure.ObjectID(req.session.userid)}, function(err, item){
			if (err)
				res.status(403).json({'error':'Insufficient rights'});
			else
				next();
		});
	});
});

/**
 * Routes
 */

// serve index and view partials
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// JSON API
require('./routes/api/post').load(app);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Start server

app.listen(app.get('port'), function(){
  console.log("Express server listening on port %d in %s mode", app.get('port'), app.settings.env);
});
