var express = require('express');
var app = module.exports = express();
var passport = require('passport');
require('./passport')(passport);


/*
 * Redis
 */
var redis = require('redis'),
  redisClient;

redisClient = redis.createClient(6379, "bojap.com");

redisClient.auth("bojappassword", function() {
  console.log('Redis client connected');
});

redisClient.select(1, function() {
  console.log("Redis database 1 selected")
});

redisClient.on("error", function(err) {
  console.log("Error " + err);
});


/*
 *  Middleware
 */
app.configure(function() {
  app.engine('jade', require('jade').__express);
  app.set('views', __dirname + '/static');
  app.set('view engine', "jade");

  app.use(express.logger("dev"));
  app.use(express.compress());	// only affects those components added after it

  // Parsers
  app.use(express.cookieParser());
  app.use(express.json());
  app.use(express.urlencoded());

  // Passport Stuff
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());

  // Middleware
  app.use(cors);
  app.use(userData);	// loggedIn

  // Serve Stuff
  app.use(app.router);
  app.use(express.static(__dirname + '/static'));	// after app.router so static index.html doesnt get served first

  // Catch Errors
  app.use(errorHandler);
});

function cors(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
}

function userData(req, res, next) {
	res.locals.loggedIn = req.isAuthenticated();
	res.locals.user = "{}";
	if (req.isAuthenticated()) {
		res.locals.user = JSON.stringify(req.user);
	}
	next();
}

function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.send(500, {
    error: 'Something blew up!'
  });
}


/*
 *  ENDPOINTS
 */
app.get('/ping', function (req, res) {
  res.send({ loggedIn: req.isAuthenticated(), user: req.user });
});

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email', "https://www.googleapis.com/auth/hangout.participants", "https://www.googleapis.com/auth/hangout.av", "https://www.googleapis.com/auth/plus.me"] }));
app.get('/auth/google/callback', passport.authenticate('google', { successRedirect: '/', failureRedirect: '/?error=login fail' }));

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

/*
 *  Launch
 */


if (!module.parent) {
  app.listen(process.env.PORT || process.argv[2] || 8080);
}