"use strict";

var db = require('../core/db');
var auth = require('../core/auth')

var User = {};

User.get = function (req, res) {
  var id = req.param('id');

  // validate input
  if (!id || id == "self") {
    id = req.user._id;
  }

  // // parse object id
  // try {
  //   id = require('mongoose').Types.ObjectId(id);
  // } catch (e) {
  //   return res.send({ error: 400, message: "ID field not an ObjectId", payload: e.message });
  // }

  db.User.findOne({ _id: id }).exec(function (err, user) {
    // error
    if (err) return res.send({ error: 400, message: "Most likely invalid id", payload: err });

    // dne
    if (!user) return res.send({ error: 404, message: "User not found", payload: user });

    // success
    console.log("User.get", user);
    res.send({ success: 200, payload: user });
  });
};

User.save = function (req, res) {
  var id = req.param('id');
  var displayName = req.param('displayName');
  var email = req.param('email');

  if (!id) {
    // create
    var newUser = db.User({
      displayName: req.param('displayName'),
      email: req.param('email'),
      password: req.param('password') 
    });

    newUser.save(function (err, user) {
      // error
      if (err) return res.send({ error: 400, payload: err });

      // success
      console.log(user);
      res.send({ success: 201, payload: user });
    });
  } else {
    // parse object id
    try {
      id = require('mongoose').Types.ObjectId(req.param('id'));
    } catch (e) {
      return res.send({ error: 400, message: "ID field not an ObjectId", payload: e.message });
    }
    
    // edit
    db.User.findOne({ _id: id })
    .exec(function (err, user) {
      // error
      if (err) return res.send({ error: 400, payload: user });

      // not found 
      if (!user) return res.send({ error: 404, message: "User not found" });

      // edit user
      email ? user.email = email : null;
      displayName ? user.displayName = displayName : null;

      user.save(function (err, user) {
        if (err) return res.send({ error: 400, message: "Couldn't save user changes", payload: err });
        console.log("saved", user);
        res.send({ success: 200, payload: user });
      })
    });
  }
};

User.remove = function (req, res) {
  var id;

  // parse object id
  try {
    id = require('mongoose').Types.ObjectId(req.param('id'));
  } catch (e) {
    return res.send({ error: 400, message: "ID field not an ObjectId", payload: e.message });
  }

  // validate input
  if (!id) {
    return res.send({ error: 400, message: "ID field missing" });
  }

  db.User.findOneAndRemove({ _id: id })
  .exec(function (err, user) {
    // error
    if (err) return res.send({ error: 400, payload: err });

    // not found
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
    if (err) return res.send({ error: 400, payload: err });

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
    // error
    if (err) return res.send({ error: 400, message: err });

    // not found. result = number of deleted tokens
    if (!result) return res.send({ error: 404, message: "Couldn't find token to logout" });

    // success
    res.send({ success: 200, message: "Logged out" });
  });
};

module.exports = User;