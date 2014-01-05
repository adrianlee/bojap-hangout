var express = require('express');
var app = express();

app.use(express.logger("dev"));
app.use(express.compress());
app.use(express.methodOverride());
app.use(express.json());
app.use(express.urlencoded());
app.use(errorHandler);

app.get('/', function(req, res) {
  res.send('hello world');
});

app.post('/create', function(req, res) {
  console.log("Hangout Created!");
  res.header('Access-Control-Allow-Origin', "*");

  // console.log(req.param("url"));
  console.log(req.body);

  res.send(200);
});

app.post('/heartbeat', function (req, res) {
  console.log("Heartbeat Received");

  console.log(req.body);

  res.send(200);
});

function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.send(500, { error: 'Something blew up!' });
}

app.listen(3000);