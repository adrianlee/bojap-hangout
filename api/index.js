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

api.get('/user.get', User.get)  // Retrieve the details of one or many users. Use self to retrieve the authenticated user.
api.post('/user.save', User.save)  // Update an existing user or create a new one. When updating an existing user, specifying only partial fields will only result in those fields being updated.
api.post('/user.remove', User.remove) // Remove one or many users.
api.get('/user.login', User.login)  // If login and password is correct a temporary session token will be created. Use this token to authenticate other API calls. This method does not require a token for authentication (see Authentication).
api.get('/user.logout', User.logout)

// TO IMPLEMENT
api.get('/user.search')  // Search for a set of users according to criteria.
api.get('/user.count')  // Count the number of users with or without filtering.
api.get('/user.resetPassword')
api.get('/user.changePassword')
api.get('/user.hasFeature')
api.get('/user.hasPermission')
api.get('/user.getSubscriptionDetail')




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