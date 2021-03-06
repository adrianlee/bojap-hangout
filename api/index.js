"use strict";

var express = require('express');
var api = express();
var server = module.exports = require('http').createServer(api);

var when = require('when');

var hangout = require('./hangout');
var middleware = require('./middleware');
var faye = require('./faye')(server);

var Users = require('./Users');
var Profiles = require('./Profiles');
var Messages = require('./Messages');

/*
 * Middleware
 */
api.disable('x-powered-by');
api.use(express.logger("dev"));
api.use(express.json());
api.use(express.urlencoded());
api.use(express.methodOverride()); // looks for DELETE verbs in hidden fields
api.use(function cors (req, res, next) {
  // CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods:", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers:", "X-Requested-With, Authorization, Content-Type");
  if (req.method == 'OPTIONS') {
    return res.send(200);
  }
  next();
});

// Server
api.get('/', function (req, res) {
  res.send("Bojap API");
});

api.get('/health', function (req, res) {
  res.send({
    pid: process.pid,
    memory: process.memoryUsage(),
    uptime: process.uptime()
  })
});

// Login & Logout
api.get('/login', Users.login);
api.get('/logout', middleware.auth, Users.logout);

// User Resource
api.post('/users', Users.create);  // Create a new user
api.get('/users', middleware.auth, Users.list); // Get list of users
api.get('/users/:id', middleware.auth, Users.read); // Get a user
api.put('/users/:id', middleware.auth, Users.update); // Update user information
api.del('/users/:id', middleware.auth, Users.remove); // Delete a user

// Profile Resource
api.post('/profiles', Profiles.create); // Create a new profile
api.get('/profiles', Profiles.list); // List profiles
api.get('/profiles/:id', Profiles.read); // Get a profile
api.put('/profiles/:id', middleware.auth, Profiles.update); // Update a profile
api.del('/profiles/:id', middleware.auth, Profiles.remove); // Delete a profile

// Messages Resource
api.post('/messages', middleware.auth, Messages.create); // Send a message
api.get('/messages', middleware.auth, Messages.list); // List messages
api.get('/messages/:id', middleware.auth, Messages.read); // Get a message
api.put('/messages/:id', middleware.auth, Messages.update); // Edit a message
api.del('/messages/:id', middleware.auth, Messages.remove); // Delete a message

// Hangout
// api.get('/rooms', hangout.rooms.get);
// api.post('/rooms', hangout.rooms.post);
// api.get('/heartbeat', hangout.heartbeat.get);
// api.post('/heartbeat', hangout.heartbeat.post);

// User
// api.post('/user.login', User.login);
// api.get('/user.logout', middleware.auth, User.logout);
// api.post('/user.get', middleware.auth, User.get);
// api.post('/user.create', User.create);
// api.post('/user.save', middleware.auth, User.save);  
// api.post('/user.remove', middleware.auth, User.remove);

// TO IMPLEMENT
// api.get('/user.search');
// api.get('/user.count');
// api.get('/user.resetPassword');
// api.get('/user.changePassword');
// api.get('/user.hasFeature');
// api.get('/user.hasPermission');
// api.get('/user.getSubscriptionDetail');


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