var redis = require('redis');

function getSuperParent(current) {
	if (!current.parent) {
		return current;
	} else {
		return getSuperParent(current.parent);
	}
}

function isApi() {
	return (getSuperParent(module).filename.indexOf('api.js') != -1);
}

// Only API server needs to access the MAIN redis server
if (isApi()) {
	// Storing Hangout Sessions
	var main = redis.createClient(6379, "bojap.com");

	main.auth("bojappassword", function() {
	  console.log('Main Redis client connected');
	});

	main.select(1, function() {
	  console.log("Main Redis database 1 selected")
	});

	main.on("error", function(err) {
	  console.log("Error " + err);
	});
}

// Storing authentication token
var auth = redis.createClient(6379, "bojap.com");

auth.auth("bojappassword", function() {
  console.log('Authentication Redis client connected');
});

auth.select(2, function() {
  console.log("Authentication Redis database 2 selected")
});

auth.on("error", function(err) {
  console.log("Error " + err);
});

module.exports = {
  print: redis.print,
  main: main,
  auth: auth
};