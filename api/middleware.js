var auth = require('../core/auth');
var express = require('express');

function authentication(req, res, next) {
  console.log("Authenticating Request");
  
  // parse token from header
  var auth_header = req.headers['authorization'];
  console.log("Authorization Header is: ", auth_header);

  if (!auth_header) {
    // Sending a 401 will require authentication, we need to send the 'WWW-Authenticate' to tell them the sort of authentication to use
    // Basic auth is quite literally the easiest and least secure, it simply gives back  base64( username + ":" + password ) from the browser
    res.statusCode = 401;
    // res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');

    res.send('Need some credentials');
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
        return res.send(401, "token invalid")
      }

      console.log(profile);
      req.user = profile;

      next();
    });
  }
};

function basic_auth (req, res, next) {
    if (req.headers.authorization && req.headers.authorization.search('Basic ') === 0) {
        // fetch login and password
        if (new Buffer(req.headers.authorization.split(' ')[1], 'base64').toString() == 'usernamehere123:passwordhere123') {
            next();
            return;
        }
    }
    console.log('Unable to authenticate user');
    console.log(req.headers.authorization);
    res.header('WWW-Authenticate', 'Basic realm="Admin Area"');
    if (req.headers.authorization) {
        setTimeout(function () {
            res.send('Authentication required', 401);
        }, 5000);
    } else {
        res.send('Authentication required', 401);
    }
}

module.exports = {
  authentication: authentication
}