var auth = require('../core/auth');

function authentication(req, res, next) {
  // parse token from header
  console.log("authNeeded");
  var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7ImRpc3BsYXlOYW1lIjoiQWRyaWFuIiwiX2lkIjoiNTJkNGQxODY5YjI2MGFlYzE5OTUwMWY2IiwiX192IjowfSwiZ29vZ2xlX3Rva2VuIjoieWEyOS4xLkFBRHROX1diSzc4MVpkVnFDU01VQzc1ci1IMHA3ZGJLTFc5ZFIyb3RyR2pZOU1DbTNuX3FXR1RWbE5CLUQwMl8ifQ.JFKnv4fAlryLB4oW8bOYuKETjTPqZnvU5CO0QWI4pBw";

  // check if valid and fetch payload
  auth.checkToken(token, function (err, profile) {
    if (err) return res.send(400);

    console.log(profile);
    if (!profile) {
      console.log("token invalid");
      return res.send(401)
    }
    next();
  });
};

module.exports = {
  authentication: authentication
}