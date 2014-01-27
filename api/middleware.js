"use strict";

var auth = require('../core/auth');
var express = require('express');

function authentication(req, res, next) {
  console.log("Authenticating Request");
  
  // parse token from header
  var auth_header = req.headers['authorization'];
  console.log("Authorization Header is: ", auth_header);

  if (!auth_header) {
    res.send({ error: 401, message: "Need some credentials" });
  } else {
    var tmp = auth_header.split(' ');
    var buf = new Buffer(tmp[1], 'base64');
    var plain_auth = buf.toString();
    console.log("Decoded Authorization ", plain_auth);
    var creds = plain_auth.split(':');
    var username = creds[0];
    var password = creds[1];

    auth.checkToken(username, function (err, profile) {
      if (err) return res.send(400);

      // token invalid
      if (!profile) {
        return res.send({ error: 404, message: "token invalid" });
      }

      console.log(profile);
      req.user = profile;

      next();
    });
  }
};

module.exports = {
  authentication: authentication
}