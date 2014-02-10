"use strict";

var db = require('../core/db');
var auth = require('../core/auth')

var User = {};

User.create = function (req, res) {
  if (req.user) return res.send({ error: 400, message: "Please log out before you create a new account"});

  // create
  var newUser = db.User({
    displayName: req.param('displayName'),
    email: req.param('email'),
    password: req.param('password') 
  });

  newUser.save(function (err, user) {
    if (err) return res.send({ error: 400, message: "Validation error", debug: err });

    console.log(user);
    res.send({ success: 201, payload: user });
  });
};

User.get = function (req, res) {
  var id = req.param('id');
  var include = "+email";

  // validate input
  if (!id || id == "me") {
    id = req.user && req.user._id;
  }

  db.User.findOne({ _id: id }).select(include).exec(function (err, user) {
    if (err) return res.send({ error: 400, message: "Most likely invalid id", debug: err });
    if (!user) return res.send({ error: 404, message: "User not found", debug: user });

    res.send({ success: 200, payload: user });
  });
};

User.save = function (req, res) {
  var id = req.param('id');

  if (!id) return res.send({ error: 400, message: "Specify an ID" });

  // assign me to id
  if (id == "me") {
    id = req.user && req.user._id;
  }

  // parse object id
  try {
    id = require('mongoose').Types.ObjectId(id);
  } catch (e) {
    return res.send({ error: 400, message: "ID field not an ObjectId", debug: e.message });
  }

  console.log(req.user._id, "is trying to edit profile", id);

  if (req.user._id != id) {
    return res.send({ error: 400, message: "You don't have permissions to edit profile" + id });
  }
  
  // edit
  db.User.findOne({ _id: id })
  .exec(function (err, user) {
    if (err) return res.send({ error: 400, debug: user });
    if (!user) return res.send({ error: 404, message: "User not found" });

    // edit user
    req.param('email') ? user.email = req.param('email') : null;
    req.param('displayName') ? user.displayName = req.param('displayName') : null;

    user.save(function (err, user) {
      if (err) return res.send({ error: 400, message: "Couldn't save user changes", payload: err });
      console.log("saved", user);
      res.send({ success: 200, payload: user });
    })
  });
};

User.remove = function (req, res) {
  var id = req.param('id');

  // parse object id
  try {
    id = require('mongoose').Types.ObjectId(id);
  } catch (e) {
    return res.send({ error: 400, message: "ID field not an ObjectId", debug: e.message });
  }

  // validate input
  if (!id) {
    return res.send({ error: 400, message: "ID field missing" });
  }

  db.User.findOneAndRemove({ _id: id })
  .exec(function (err, user) {
    if (err) return res.send({ error: 400, debug: err });
    if (!user) return res.send({ error: 404, message: "User not found" });

    // success
    console.log(user);
    res.send({ success: 200, payload: user });
  });
};


User.login = function (req, res) {
  var email = req.param('email');
  var password = req.param('password');

  // validate 
  if (!email) return res.send({ error: 403, message: "Missing email" });
  if (!password) return res.send({ error: 403, message: "Missing password" });

  db.User.findOne({ email: email })
  .select('+password')
  .exec(function (err, user) {
    // error
    if (err) return res.send({ error: 400, debug: err });

    // not found
    if (!user) return res.send({ error: 404, message: "User not found" });

    // compare password
    user.comparePassword(password, function(err, isMatch) {
      // error
      if (err) return res.send({ error: 400, message: "Something went wrong in comparePassword", payload: err });

      // wrong password
      if (!isMatch) return res.send({ error: 403, message: "Wrong Password"});

      // success
      // remove password from user doc
      user.password = undefined;
      console.log("User.login:", user);

      // generate token
      var token = auth.getToken(user);
      if (!token) return res.send({ error: 400, message: "Couldn't generate token" });

      res.send({ success: 200, payload: user, token: token });
    });

  });
};


User.logout = function (req, res) {
  auth.deleteToken(req.token, function (err, result) {
    if (err) return res.send({ error: 400, debug: err });
    if (!result) return res.send({ error: 404, message: "Couldn't find token to logout" });

    // success
    res.send({ success: 200, message: "Logged out" });
  });
};

module.exports = User;