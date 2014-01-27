var jwt = require('jwt-simple');
var redisAuth = require('./redis').auth;
var config = require('../config');
var db = require('./db');

var REDIS_TOKEN_EXPIRE = 31*24*60*60;
var REDIS_USER_EXPIRE = 10;

// generates a token with user id and current time.
function getToken(user) {
  var token, json;

  if (!user) return;

  // json object used to generate token
  json = {};
  json.id = user.id;
  json.timestamp = new Date().getTime();

  // generate token via payload (should be user id and timestamp)
  try {
    token = jwt.encode(json, config.jwtSecret);
  } catch (e) {
    console.err('jwt.encode failed:', e.message);
    return;
  }
  
  // async save user id to auth:token key
  redisAuth.setex('auth:'+token, REDIS_TOKEN_EXPIRE, json.id, require('./redis').print)

  return token;
};

// get profile from token. fetch from redis or db.
function getProfile(token, cb) {
  var payload;
  var id;

  // decode token
  try {
    payload = jwt.decode(token, config.jwtSecret);
  } catch (err) {
    return cb(err.message);
  }

  // get user id from token
  id = payload.id
  if (!id) return cb("No id in token");

  // get profile from user id  
  redisAuth.get('user:'+id, function (err, redisResult) {
    if (err) return cb(err);

    // redis miss
    if (!redisResult) {
      db.User.findById(id)
      .exec(function (err, dbResult) {
        if (err) return cb(err);

        // db miss
        if (!dbResult) return cb("Profile doesn't exist for user id " + id);

        // db hit
        // console.log("db hit");
        redisAuth.setex('user:'+id, REDIS_USER_EXPIRE, JSON.stringify(dbResult), require('./redis').print)
        cb(null, dbResult);
      });
    } else {
      // redis hit
      // console.log("redis hit");
      cb(null, JSON.parse(redisResult));
    }
  });
};

// delete token used for logout.
function deleteToken(token, cb) {
  redisAuth.del('auth:'+token, function (err, result) {
    cb(err, result);
  });
};

module.exports = {
  getToken: getToken,
  getProfile: getProfile,
  deleteToken: deleteToken
};