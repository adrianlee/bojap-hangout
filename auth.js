var jwt = require('jwt-simple');
var secret = "omg wtf bbq bojap ftw awesome legit";

var redisAuth = require('./redis').auth;

var encode = function (payload) {
  var token;

  try {
    token = jwt.encode(payload, secret);
  } catch (e) {
    return;
  }
  

  redisAuth.set('auth:'+token, payload.user, require('./redis').print)
  redisAuth.expire('auth:'+token, 31*24*60*60, require('./redis').print)

  return token;
};

var decode = function (token, cb) {
  var payload;

  try {
    payload = jwt.decode(token, secret);
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

module.exports = {
  getToken: encode,
  checkToken: decode
};