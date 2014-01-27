var jwt = require('jwt-simple');
var redisAuth = require('./redis').auth;
var config = require('../config');

function encode(payload) {
  var token;

  try {
    token = jwt.encode(payload, config.jwtSecret);
  } catch (e) {
    console.err('jwt.encode failed:', e.message);
    return;
  }
  
  // async operation
  redisAuth.set('auth:'+token, 0, require('./redis').print)
  redisAuth.expire('auth:'+token, 31*24*60*60, require('./redis').print)

  return token;
};

function decode(token, cb) {
  var payload;

  try {
    payload = jwt.decode(token, config.jwtSecret);
  } catch (e) {
    return cb(e);
  }
  
  redisAuth.get('auth:'+token, function (err, user) {
    if (!user) {
      console.log("doesnt exist");
      return cb(err)
    }

    return cb(err, payload);
  });
};

function deleteToken(token, cb) {
  redisAuth.del('auth:'+token, function (err, result) {
    cb(err, result);
  });
}

module.exports = {
  getToken: encode,
  checkToken: decode,
  deleteToken: deleteToken
};