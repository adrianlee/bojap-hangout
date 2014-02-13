"use strict";

var auth = require('../core/auth');
var config = require('../config');

function parseToken (authorization) {
  var tmp = authorization.split(' ');
  var buf = new Buffer(tmp[1], 'base64');
  var plain_auth = buf.toString();
  var creds = plain_auth.split(':');
  var token = creds[0]; // creds[1] is not used
  return token;
}

module.exports = {
  // Parse Authorization Header for token.
  auth: function (req, res, next) {
    if (!req.headers['authorization']) return res.send(401, { message: "Need some credentials" });

    // check if user is logged in, save user id in req.user
    auth.checkToken(parseToken(req.headers['authorization']), function (err, userId) {
      if (err) return next(err);
      if (!userId) return res.send(400, { message: "bad token" });

      req.user = { _id: userId };

      // Add admin flag to admins
      if (config.admins.indexOf(userId) != -1) {
        req.admin = true;
      }

      next();
    });
  }
}