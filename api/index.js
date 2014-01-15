var express = require('express');
var api = module.exports = express();


var when = require('when');

var hangout = require('./hangout');
var profile = require('./profile');
var messages = require('./messages');
var middleware = require('./middleware');


/*
 * Middleware
 */
api.use(express.logger("dev"));
api.use(express.json());
api.use(express.urlencoded());

// Server
api.get('/', function (req, res) {
  res.redirect('/health');
});

api.get('/health', middleware.authentication, function (req, res) {
  res.send({
    pid: process.pid,
    memory: process.memoryUsage(),
    uptime: process.uptime()
  })
});

// Hangout
api.get('/rooms', hangout.rooms.get);
api.post('/rooms', hangout.rooms.post);
api.get('/heartbeat', hangout.heartbeat.get);
api.post('/heartbeat', hangout.heartbeat.post);

// Profile
api.get('/profile', profile.getById);

// Messages
api.get('/messages', messages.getMessages);
api.post('/messages', messages.postMessages);


/*
 *  Launch
 */
if (!module.parent) {
  console.log("not parent")
  var server = api.listen(process.env.PORT || process.argv[2] || 8011);

  server.on('error', function (err) {
    console.error(err)
  });
}