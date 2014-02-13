"use strict";

var db = require('../core/db');
var auth = require('../core/auth')

var Users = {};


// LOGIN
// Route: GET /login?email=&password=
// Permissions: public
Users.login = function (req, res) {
  var email = req.param('email');
  var password = req.param('password');

  // validate 
  if (!email) return res.send(400, { message: "Missing email" });
  if (!password) return res.send(400, { message: "Missing password" });

  db.User.findOne({ email: email })
  .select('+password +email')
  .exec(function (err, user) {
    // error
    if (err) return res.send(400, { error: err });

    // not found
    if (!user) return res.send(400, { message: "User not found" });

    // compare password
    user.comparePassword(password, function(err, isMatch) {
      // error
      if (err) return res.send(400, { message: "Something went wrong in comparePassword", error: err });

      // wrong password
      if (!isMatch) return res.send(400, { message: "Wrong Password"});

      // success
      // remove password from user doc
      user.password = undefined;
      console.log("User.login:", user);

      // generate token
      var token = auth.getToken(user);
      if (!token) return res.send(400, { message: "Couldn't generate token" });

      res.send(200, { token: token, user: user });
    });
  });
};


// LOGOUT
// Route: GET /logout
// Permissions: self
Users.logout = function (req, res) {
  auth.deleteToken(req.token, function (err, result) {
    if (err) return res.send(400, { error: err });

    // below statement should never hit...
    if (!result) return res.send(404, { message: "Couldn't find token to logout" });

    // success
    res.send(200, { message: "Logged out" });
  });
};


// LIST USERS
// Route: GET /users
// Permissions: admin
Users.list = function (req, res) {
  // check permissions
  if (!req.admin) return res.send(401);

  db.User.find().select('+email').exec(function (err, user) {
    if (err) return res.send(400, { message: "Something went wrong", error: err });
    res.send(200, user);
  });
};


// GET A USER
// Route: GET /users/:id
// Permissions: self, admin
Users.read = function (req, res) {
  var id = req.param('id');

  if (!id) return res.send(400, { message: "Specify an ID" });
  
  // validate input
  if (id == "me") {
    id = req.user && req.user._id;
  }

  // check permissions
  if (id !== (req.user && req.user._id)) {
    if (!req.admin) return res.send(401);
  }

  db.User.findOne({ _id: id }).select('+email').exec(function (err, user) {
    if (err) return res.send(400, { message: "Most likely invalid id", error: err });

    res.send(200, user);
  });
};


// CREATE A NEW USER
// Route: POST /users
// Permissions: public
Users.create = function (req, res) {
  var newUser = db.User({
    displayName: req.param('displayName'),
    email: req.param('email'),
    password: req.param('password') 
  });

  newUser.save(function (err, user) {
    if (err) return res.send(400, { message: "Validation error", error: err });

    console.log(user);
    res.send(201, user);
  });
};


// UPDATE A USER
// Route: PUT /users/:id
// Permissions: self, admin
Users.update = function (req, res) {
  var id = req.param('id');

  if (!id) return res.send(400, { message: "Specify an ID" });

  // validate input
  if (id == "me") {
    id = req.user && req.user._id;
  }

  // check permissions
  if (id !== (req.user && req.user._id)) {
    if (!req.admin) return res.send(401);
  }

  // edit
  db.User.findOne({ _id: id })
  .select('+email')
  .exec(function (err, user) {
    if (err) return res.send(400, { error: user });
    if (!user) return res.send(404, { message: "User not found" });

    // edit user
    req.param('email') ? user.email = req.param('email') : null;
    req.param('displayName') ? user.displayName = req.param('displayName') : null;
    req.param('password') ? user.password = req.param('password') : null;

    user.save(function (err, user) {
      if (err) return res.send(400, { message: "Couldn't save user changes", payload: err });
      console.log("saved", user);
      user.password = undefined;
      res.send(200, user);
    })
  });
};


// DELETE USER
// Route: DEL /users/:id
// Permissions: admin
Users.remove = function (req, res) {
  var id = req.param('id');

  // check permissions
  if (!req.admin) return res.send(401);
  
  // validate input
  if (!id) {
    return res.send(400, { message: "ID field missing" });
  }

  db.User.findOneAndRemove({ _id: id })
  .exec(function (err, user) {
    if (err) return res.send(400, { error: err });
    if (!user) return res.send(404, { message: "User not found" });

    // success
    console.log("deleted", user);
    res.send(200, user);
  });
};


module.exports = Users;