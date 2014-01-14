var express = require('express'); 
var app = express(); 
 
app
.use(express.vhost('bojap.com', require('./app')))
.use(express.vhost('bojap.com/api', require('./api')))
.listen(process.env.PORT || process.argv[2] || 3000);