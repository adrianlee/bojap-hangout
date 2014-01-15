var redis = require('redis');

var main = redis.createClient(6379, "bojap.com");

main.auth("bojappassword", function() {
  console.log('Redis client connected');
});

main.select(1, function() {
  console.log("Redis database 1 selected")
});

main.on("error", function(err) {
  console.log("Error " + err);
});

var auth = redis.createClient(6379, "bojap.com");

auth.auth("bojappassword", function() {
  console.log('Redis client connected');
});

auth.select(2, function() {
  console.log("Redis database 2 selected")
});

auth.on("error", function(err) {
  console.log("Error " + err);
});

module.exports = {
  print: redis.print,
  main: main,
  auth: auth
};