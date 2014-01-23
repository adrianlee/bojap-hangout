var express = require('express');
var app = module.exports = express();

var passport = require('passport');
require('../core/passport')(passport);

var RedisStore = require('connect-redis')(express);

var auth = require('../core/auth');

/*
 *  Middleware
 */
app.configure(function() {
  app.engine('jade', require('jade').__express);
  app.set('views', __dirname + '/static');
  app.set('view engine', "jade");

  app.use(express.logger("dev"));
  app.use(express.compress());  // only affects those components added after it
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(passport.initialize());

  // Middleware
  function cors(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    next();
  }
  app.use(cors);

  // Serve Stuff
  app.use(app.router);
  app.use(express.static(__dirname + '/static')); // after app.router so static index.html doesnt get served first

  // Catch Errors

  function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.send(500, {
      error: 'Something blew up!',
      stack: err.stack
    });
  }

  app.use(errorHandler);

  app.on('error', function (err) {
    console.error(err)
  });

  process.on('uncaughtException', function (err) {
    console.error('uncaughtException:', err.message);
    console.error(err.stack);
    process.exit(1);
  });
});


// Google OAuth
app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email', "https://www.googleapis.com/auth/hangout.participants", "https://www.googleapis.com/auth/hangout.av", "https://www.googleapis.com/auth/plus.me"] }));
app.get('/auth/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/?error=login failed' }), function (req, res) {
  var JWT = auth.getToken({ user: req.user.user, google_token: req.user.token });
  if (!JWT) {
    res.send(500, "Unable to generate auth token")
  }
  console.log(JWT);
  res.redirect('/#/?' + require('querystring').stringify({ user: req.user.user.id, token: JWT }))
});

// Health
app.get('/health', function (req, res) {
  res.send({
    pid: process.pid,
    memory: process.memoryUsage(),
    uptime: process.uptime()
  })
});

/*
 *  Launch
 */
if (!module.parent) {
  var server = app.listen(process.env.PORT || process.argv[2] || 8010);

  server.on('error', function (err) {
    console.error(err)
  });
}