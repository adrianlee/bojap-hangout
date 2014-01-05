var express = require('express');
var app = express();


/*
 * Redis
 */
var redis = require('redis'),
  redisClient = redis.createClient();

redisClient.select(1, function() {
  console.log("Redis database 1 selected")
});

redisClient.on("error", function(err) {
  console.log("Error " + err);
});

// redisClient.set("string key", "Yay", redis.print);
// redisClient.get("string key", redis.print);

// redisClient.ltrim("rooms", 0, 3, redis.print);

/*
 *  Middleware
 */
app.use(express.logger("dev"));
app.use(express.compress());
app.use(express.methodOverride());
app.use(express.json());
app.use(express.urlencoded());
app.use(cors);
app.use(errorHandler);

function cors(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  next();
}

function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.send(500, {
    error: 'Something blew up!'
  });
}


/*
 *  ENDPOINTS
 */
app.get('/', function (req, res) {
  res.send('hello world');
});

app.get('/rooms', function (req, res) {
  var min_ago = 60 * 1000;
  var time = Date.now() - min_ago;

  redisClient.ZREVRANGEBYSCORE('rooms:online', "+inf", time, function (err, list) {
    // console.log(list);
    redisClient.hmget("rooms", list, function (err, rooms) {
      // console.log(rooms);
      for (var room in rooms) {
        rooms[room] = JSON.parse(rooms[room]);
      }
      res.send(rooms);
    });
  });
});

app.post('/rooms', function (req, res) {
  console.log("Hangout Created!");
  // console.log(req.param("id"));
  // console.log(req.param("url"));
  // console.log(req.body);

  // redisClient.lpush('rooms', JSON.stringify(req.body), redis.print);
  redisClient.hset(["rooms", req.param("id"), JSON.stringify(req.body)], redis.print);

  res.send(200);
});


app.get('/heartbeat', function (req, res) {
  var min_ago = 60 * 1000;
  var time = Date.now() - min_ago;

  redisClient.ZREVRANGEBYSCORE('rooms:online', "+inf", time, function (err, data) {
    res.send(data);
  });
});

app.post('/heartbeat', function (req, res) {
  console.log("Heartbeat Received");
  console.log(req.body);
  
  redisClient.ZADD('rooms:online', Date.now(), req.param("id"), redis.print);

  res.send(200);
});


/*
 *  Launch
 */
app.listen(3000);