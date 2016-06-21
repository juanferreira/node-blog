var express = require('express'),
	path = require('path'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	morgan = require('morgan'),
	config = require('config'),
	utils = require('./lib/utils'),
	methodOverride = require('method-override'),
	mongoose = require('mongoose'),
	mongooseConnection = utils.connectToDatabase(mongoose, config.db),
	passport = require('passport'),
	session = require('express-session'),
	sessionStore = require('connect-redis')(session),
	flash = require('connect-flash'),
	app = express();

app.set("port", process.env.PORT || 3000);

app.use(express.static(path.join(__dirname, '/public')));
app.use(morgan('dev')); // Log every request to console
app.use(bodyParser()); // Pull information from POST request
app.use(cookieParser()); // Parse cookie headers from request
app.use(methodOverride()); // Simulate DELETE and PUT
app.use(session({
	secret: 'secret-password',
	store: new sessionStore({ url: process.env.REDIS_URL || config.redis.URL })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(require('./lib/views')); // export req to view

app.set('views', path.join(__dirname, '/public/views'));
app.set('view engine', 'jade'); // Use Jade template engine
app.set('view options', { layout: true }); // Use Jade's layout structure

// Load models
require("./models/Article")(mongooseConnection);
require("./models/User")(mongooseConnection);
require("./models/Comment")(mongooseConnection);

// Load controllers
require("./controllers/IndexController")(app, mongooseConnection);
require("./controllers/ArticleController")(app, mongooseConnection);
require("./controllers/CommentController")(app, mongooseConnection);
require("./controllers/UserController")(app, mongooseConnection);

app.listen(app.get("port"), function(){
	console.log("Express server listening on port " + app.get("port"))
});