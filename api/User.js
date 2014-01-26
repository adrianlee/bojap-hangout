"use strict";

var db = require('../core/db');

var User = {};

User.get = function (req, res) {
  var id = req.param('id');

  // validate input
  if (!id) {
    return res.send({ error: 400, message: "ID field missing" });
  }

  // parse object id
  try {
    id = require('mongoose').Types.ObjectId(req.param('id'));
  } catch (e) {
    return res.send({ error: 400, message: "ID field not an ObjectId", payload: e.message });
  }


  db.User.findOne({ _id: id }).exec(function (err, user) {
    // error
    if (err) return res.send({ error: 404, payload: err });

    // success
    console.log(user);
    res.send({ success: 200, payload: user });
  });
};

User.save = function (req, res) {
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
  if (!email) return res.send({ error: 400, message: "Missing email" });
  if (!password) return res.send({ error: 400, message: "Missing password" });

  db.User.findOne({ email: email })
  .select('+password')
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

User.logout = function () {

};

module.exports = User;