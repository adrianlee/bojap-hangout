"use strict";

var auth = require('../core/auth');
var express = require('express');

module.exports = {
  // Parse Authorization Header for token to fetch user profile.
  authentication: function (req, res, next) {
    // console.log("Authenticating Request");
    
    // parse token from header
    var auth_header = req.headers['authorization'];
    // console.log("Authorization Header is: ", auth_header);

    if (!auth_header) {
      res.send({ error: 401, message: "Need some credentials" });
    } else {
      var tmp = auth_header.split(' ');
      var buf = new Buffer(tmp[1], 'base64');
      var plain_auth = buf.toString();
      // console.log("Decoded Authorization ", plain_auth);
      var creds = plain_auth.split(':');
      var token = creds[0]; // creds[1] is not used

      // check if user is logged in, save user id in req.
      auth.checkToken(token, function (err, result) {
        if (err) return next(err);
        if (!result) return res.send({ error: 400, message: "bad token" });
        req.user = { _id: result };
        next();
      });

      // auth.getProfile(token, function (err, profile) {
      //   if (err) return res.send({ error: 400, message: "Token is invalid", payload: err });

      //   // token invalid
      //   if (!profile) {
      //     return res.send({ error: 404, message: "Profile not found" });
      //   }

      //   // console.log("Middleware.Auth", profile);
      //   console.log("User is authed");
      //   req.user = profile;
      //   req.token = token;

      //   next();
      // });
    }
  }
}