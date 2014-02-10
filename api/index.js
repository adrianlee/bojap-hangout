"use strict";

var express = require('express');
var api = express();
var server = module.exports = require('http').createServer(api);

var when = require('when');

var hangout = require('./hangout');
var profile = require('./profile');
var messages = require('./messages');
var middleware = require('./middleware');
var faye = require('./faye')(server);

var User = require('./User');

/*
 * Middleware
 */
api.disable('x-powered-by');
api.use(express.logger("dev"));
api.use(express.json());
api.use(express.urlencoded());
api.use(function cors (req, res, next) {
  // CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods:", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers:", "X-Requested-With, Authorization, Content-Type");
  next();
});

// Server
api.get('/', function (req, res) {
  res.send("bojap api server");
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

// User
api.post('/user.login', User.login);
api.get('/user.logout', middleware.authentication, User.logout);
api.post('/user.get', middleware.authentication, User.get);
api.post('/user.create', User.create);
api.post('/user.save', middleware.authentication, User.save);  
api.post('/user.remove', middleware.authentication, User.remove);

// TO IMPLEMENT
api.get('/user.search');
api.get('/user.count');
api.get('/user.resetPassword');
api.get('/user.changePassword');
api.get('/user.hasFeature');
api.get('/user.hasPermission');
api.get('/user.getSubscriptionDetail');


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