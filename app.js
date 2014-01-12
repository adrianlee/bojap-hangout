var express = require('express');
var app = module.exports = express();

var passport = require('passport');
require('./passport')(passport);

var redis = require('redis');
var RedisStore = require('connect-redis')(express);
var redisClient = require('./redis')().client;

var mongoose = require('mongoose');
require('./mongoose')(mongoose);

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
  app.use(express.session({ store: new RedisStore({ port:6379, host:"bojap.com", pass:"bojappassword", db:2 }), secret: 'bojap cat' }));
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

app.on('error', function (err) {
  console.error(err)
});

process.on('uncaughtException', function (err) {
  console.error('uncaughtException:', err.message);
  console.error(err.stack);
  process.exit(1);
});


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



app.get('/rooms', function (req, res) {
  var min_ago = 60 * 1000;
  var time = Date.now() - min_ago;

  redisClient.ZREVRANGEBYSCORE('rooms:online', "+inf", time, function (err, list) {
    redisClient.hmget("rooms", list, function (err, rooms) {
      console.log(rooms);
      for (var room in rooms) {
        rooms[room] = JSON.parse(rooms[room]);
      }
      res.send(rooms);
    });
  });
});

app.post('/rooms', function (req, res) {
  console.log("Hangout Created!");
  redisClient.hset(["rooms", req.param("id"), JSON.stringify(req.body)], redis.print);

  res.send(200);
});

app.get('/heartbeat', function (req, res) {
  var min_ago = 60 * 1000;
  var time = Date.now() - min_ago;

  redisClient.ZREVRANGEBYSCORE('rooms:online', "+inf", time, function (err, data) {
    res.send(data);
  });
});

app.post('/heartbeat', function (req, res) {
  console.log("Heartbeat Received");
  redisClient.ZADD('rooms:online', Date.now(), req.param("id"), redis.print);

  res.send(200);
});

app.get('/health', function(req, res){
  res.send({
    pid: process.pid,
    memory: process.memoryUsage(),
    uptime: process.uptime()
  })
})


/*
 *  Launch
 */
if (!module.parent) {
  var server = app.listen(process.env.PORT || process.argv[2] || 8080);

  server.on('error', function (err) {
    console.error(err)
  });
}