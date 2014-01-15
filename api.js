var api = require('./api/');
var config = require('./config');

api.listen(config.api.port);