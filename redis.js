var redis = require('redis');

module.exports = function() {
  var redisClient = redis.createClient(6379, "bojap.com");

  redisClient.auth("bojappassword", function() {
    console.log('Redis client connected');
  });

  redisClient.select(1, function() {
    console.log("Redis database 1 selected")
  });

  redisClient.on("error", function(err) {
    console.log("Error " + err);
  });

  return {
    client: redisClient
  }
};