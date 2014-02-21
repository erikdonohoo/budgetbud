
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
	if (!req.session || (req.session && !req.session.user)) {
		res.status(401).json({'error':'Need to Authenticate'});
		return;
	}

	next();
});

/**
 * Routes
 */

// serve index and view partials
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// JSON API
require('./routes/api/user').load(app);
require('./routes/api/budget').load(app);
require('./routes/api/category').load(app);
require('./routes/api/expense').load(app);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Start server

app.listen(app.get('port'), function(){
  console.log("Express server listening on port %d in %s mode", app.get('port'), app.settings.env);
});
