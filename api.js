var express = require('express');
var api = module.exports = express();

var redis = require('redis');
var redisMain = require('./redis').main;

var db = require('./db');

var auth = require('./auth');

var when = require('when');

/*
 * Middleware
 */
api.use(express.logger("dev"));
api.use(express.json());
api.use(express.urlencoded());

function authNeeded(req, res, next) {
  // parse token from header
  console.log("authNeeded");
  var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7ImRpc3BsYXlOYW1lIjoiQWRyaWFuIiwiX2lkIjoiNTJkNGQxODY5YjI2MGFlYzE5OTUwMWY2IiwiX192IjowfSwiZ29vZ2xlX3Rva2VuIjoieWEyOS4xLkFBRHROX1diSzc4MVpkVnFDU01VQzc1ci1IMHA3ZGJLTFc5ZFIyb3RyR2pZOU1DbTNuX3FXR1RWbE5CLUQwMl8ifQ.JFKnv4fAlryLB4oW8bOYuKETjTPqZnvU5CO0QWI4pBw";

  // check if valid and fetch payload
  auth.checkToken(token, function (err, profile) {
    console.log(profile);
    if (!profile) {
      console.log("token invalid");
      res.send(401)
    }
    next();
  });
};

/*
 * Endpoitns
 */
api.get('/', function (req, res) {
  res.redirect('/health');
});

api.get('/encode', function (req, res) {
  res.send(auth.getToken({ user: "adrian" }));
});

api.get('/decode', function (req, res) {
  auth.checkToken(req.param("token"), function (err, payload) {
    if (err) return res.send(500, err);

    if (!payload) {
      return res.send(404);
    }

    res.send(payload);
  })
});

api.get('/rooms', function (req, res) {
  var min_ago = 60 * 1000;
  var time = Date.now() - min_ago;

  redisMain.ZREVRANGEBYSCORE('rooms:online', "+inf", time, function (err, list) {
    redisMain.hmget("rooms", list, function (err, rooms) {
      console.log(rooms);
      for (var room in rooms) {
        rooms[room] = JSON.parse(rooms[room]);
      }
      res.send(rooms);
    });
  });
});

api.post('/rooms', function (req, res) {
  console.log("Hangout Created!");
  redisMain.hset(["rooms", req.param("id"), JSON.stringify(req.body)], require('./redis').print);

  res.send(200);
});

api.get('/heartbeat', function (req, res) {
  var min_ago = 60 * 1000;
  var time = Date.now() - min_ago;

  redisMain.ZREVRANGEBYSCORE('rooms:online', "+inf", time, function (err, data) {
    res.send(data);
  });
});

api.post('/heartbeat', function (req, res) {
  console.log("Heartbeat Received");
  redisMain.ZADD('rooms:online', Date.now(), req.param("id"), require('./redis').print);

  res.send(200);
});

api.get('/health', authNeeded, function(req, res){
  res.send({
    pid: process.pid,
    memory: process.memoryUsage(),
    uptime: process.uptime()
  })
});

api.get('/profile', function (req, res) {
  var id = req.user && req.user._id;

  db.User.findOne({_id: id}).select('+email').exec(function (err, user) {
    if (err) return res.send(500, err);

    if (!user) return res.send(404, "user not found");

    res.send(user);
  });
});

api.get('/messages', function (req, res) {
  var id = req.user && req.user._id;

  db.Message.find({users: id}).populate('users').exec(function (err, messages) {
    if (err) return res.send(500, err);

    // if (!messages) return res.send(404, "no messages for user " + id);
    
    for (var i = 0; i < messages.length; i++) {
      for (var j = 0; j < messages[i].users.length; j++) {
        var recipient = messages[i].users[j];

        // remove current user from recipient field
        if (id.equals(recipient._id)) {
          messages[i].users.splice(j, 1);
        }
      }
    }

    console.log(messages);


    res.send(messages || []);
  });
});

api.post('/messages', function (req, res) {
  var id = req.user && req.user._id;

  if (!id) {
    return res.send(401, "UNAUTHORIZED");
  }

  var obj = {
    users: [],
    subject: req.param("subject"),
    messages: [
      {
        sender: id,
        message: req.param("message"),
        has_read: [id]
      }
    ]
  };

  // add self
  obj.users.push(id);

  // add receipient
  var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");

  if (checkForHexRegExp.test(req.param("users"))) {
    obj.users.push(req.param("users"));
  } else {
    return res.send(400, "users not an objectId");
  }

  var message = new db.Message(obj);

  message.save(function (err, savedMessage) {
    if (err) {
      console.log(err);
      return res.send(500, err);
    }

    res.send(201, savedMessage)
  });

  // var newMessage = new db.Message({
  //   users: [id,, ]
  // });
});


/*
 *  Launch
 */
if (!module.parent) {
  var server = api.listen(process.env.PORT || process.argv[2] || 8011);

  server.on('error', function (err) {
    console.error(err)
  });
}