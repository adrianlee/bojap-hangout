var redis = require('../core/redis');
var redisMain = require('../core/redis').main;


// Get a list of online rooms and their info
function getRooms (req, res) {
  console.log("rooms")
  var min_ago = 60 * 1000;
  var time = Date.now() - min_ago;

  // Check rooms which are online and have a heartbeat
  redisMain.ZREVRANGEBYSCORE('rooms:online', "+inf", time, function (err, list) {
    if (!list) return res.send([]);

    // Get room info
    redisMain.hmget("rooms", list, function (err, rooms) {
      if (!rooms) return res.send([]);

      for (var room in rooms) {
        rooms[room] = JSON.parse(rooms[room]);
      }

      res.send(rooms);
    });
  });
}

// Create a new hangout session
function postRooms (req, res) {
  console.log("Hangout Created!");
  redisMain.hset(["rooms", req.param("id"), JSON.stringify(req.body)], redis.print);

  res.send(200);
}

// Get rooms who are online
function getHeartbeat(req, res) {
  var min_ago = 60 * 1000;
  var time = Date.now() - min_ago;

  redisMain.ZREVRANGEBYSCORE('rooms:online', "+inf", time, function (err, data) {
    res.send(data);
  });
}

// A heartbeat sent by a room
function postHeartbeat(req, res) {
  console.log("Heartbeat Received");
  redisMain.ZADD('rooms:online', Date.now(), req.param("id"), redis.print);

  res.send(200);
}

module.exports = {
  rooms: {
    get: getRooms,
    post: postRooms
  },
  heartbeat: {
    get: getHeartbeat,
    post: postHeartbeat
  }
};