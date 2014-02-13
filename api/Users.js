"use strict";

var db = require('../core/db');
var auth = require('../core/auth')

var Users = {};

// GET /login?email=&password=
Users.login = function (req, res) {
  var email = req.param('email');
  var password = req.param('password');

  // validate 
  if (!email) return res.send(403, { message: "Missing email" });
  if (!password) return res.send(403, { message: "Missing password" });

  db.User.findOne({ email: email })
  .select('+password')
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
      if (!isMatch) return res.send(403, { message: "Wrong Password"});

      // success
      // remove password from user doc
      user.password = undefined;
      console.log("User.login:", user);

      // generate token
      var token = auth.getToken(user);
      if (!token) return res.send(400, { message: "Couldn't generate token" });

      res.send(200, { token: token });
    });

  });
};


// GET /logout
Users.logout = function (req, res) {
  auth.deleteToken(req.token, function (err, result) {
    if (err) return res.send(400, { error: err });
    if (!result) return res.send(404, { message: "Couldn't find token to logout" });

    // success
    res.send(200, { message: "Logged out" });
  });
};

// GET /users
Users.list = function (req, res) {
  db.User.find().exec(function (err, user) {
    if (err) return res.send(400, { message: "Something went wrong", error: err });
    if (!user) return res.send(404, { message: "No Users", error: user });

    res.send(200, { payload: user });
  });
};


// GET /users/:id
Users.read = function (req, res) {
  var id = req.param('id');
  var include;

  // validate input
  if (!id || id == "me") {
    id = req.user && req.user._id;
    include = "+email";
  }

  db.User.findOne({ _id: id }).select(include).exec(function (err, user) {
    if (err) return res.send(400, { message: "Most likely invalid id", error: err });
    if (!user) return res.send(404, { message: "User not found", error: user });

    res.send(200, { payload: user });
  });
};


// POST /users
Users.create = function (req, res) {
  if (req.user) return res.send(400, { message: "Please log out before you create a new account"});

  // create
  var newUser = db.User({
    displayName: req.param('displayName'),
    email: req.param('email'),
    password: req.param('password') 
  });

  newUser.save(function (err, user) {
    if (err) return res.send(400, { message: "Validation error", error: err });

    console.log(user);
    res.send(201, { payload: user });
  });
};


// PUT /users/:id
Users.update = function (req, res) {
  var id = req.param('id');

  if (!id) return res.send(400, { message: "Specify an ID" });

  // assign me to id
  if (id == "me") {
    id = req.user && req.user._id;
  }

  // parse object id
  try {
    id = require('mongoose').Types.ObjectId(id);
  } catch (e) {
    return res.send(400, { message: "ID field not an ObjectId", error: e.message });
  }

  console.log(req.user._id, "is trying to edit profile", id);

  if (req.user._id != id) {
    return res.send(400, { message: "You don't have permissions to edit profile" + id });
  }
  
  // edit
  db.User.findOne({ _id: id })
  .exec(function (err, user) {
    if (err) return res.send(400, { error: user });
    if (!user) return res.send(404, { message: "User not found" });

    // edit user
    req.param('email') ? user.email = req.param('email') : null;
    req.param('displayName') ? user.displayName = req.param('displayName') : null;

    user.save(function (err, user) {
      if (err) return res.send(400, { message: "Couldn't save user changes", payload: err });
      console.log("saved", user);
      res.send(200, { payload: user });
    })
  });
};


// DEL /users/:id
Users.remove = function (req, res) {
  var id = req.param('id');

  // parse object id
  try {
    id = require('mongoose').Types.ObjectId(id);
  } catch (e) {
    return res.send(400, { message: "ID field not an ObjectId", error: e.message });
  }

  // validate input
  if (!id) {
    return res.send(400, { message: "ID field missing" });
  }

  db.User.findOneAndRemove({ _id: id })
  .exec(function (err, user) {
    if (err) return res.send(400, { error: err });
    if (!user) return res.send(404, { message: "User not found" });

    // success
    console.log(user);
    res.send(200, { payload: user });
  });
};


module.exports = Users;