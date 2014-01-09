var express = require('express');
var app = express();
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
  app.engine('ejs', require('ejs-locals'));
  app.set('views', __dirname + '/static');

  app.use(express.logger("dev"));
  app.use(express.compress());
  app.use(express.static(__dirname + '/static'));
  app.use(express.cookieParser());
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(cors);
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(errorHandler);
});

function cors(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
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
app.get('/', function (req, res) {
  console.log("asd");
  res.render('index.html');
});

app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email', "https://www.googleapis.com/auth/hangout.participants", "https://www.googleapis.com/auth/hangout.av", "https://www.googleapis.com/auth/plus.me"] }));
app.get('/auth/google/callback', passport.authenticate('google', { successRedirect: '/', failureRedirect: '/?error=login fail' }));


/*
 *  Launch
 */
app.listen(process.env.PORT || process.argv[2] || 8080);