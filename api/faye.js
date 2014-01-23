var faye = require('faye');
var bayeux = new faye.NodeAdapter({mount: '/faye', timeout: 45});

bayeux.on('handshake', function(clientId) {
  console.log("handshake" + ":" + clientId);
});

bayeux.on('subscribe', function(clientId, channel) {
  console.log("subscribe:" + clientId + ":" + channel);
});

bayeux.on('unsubscribe', function(clientId, channel) {
  console.log("unsubscribe:" + clientId + ":" + channel);
});

bayeux.on('publish', function(clientId, channel, data) {
  console.log("publish:" + clientId + ":" + channel + ":" + JSON.stringify(data));
});

bayeux.on('disconnect', function(clientId) {
  console.log("disconnect:" + clientId);
});

module.exports = function (server) {
  bayeux.attach(server);

  var serverAuth = {
    incoming: function(message, callback) {
      // Let non-subscribe messages through
      if (message.channel !== '/meta/subscribe')
        return callback(message);

      // Get subscribed channel and auth token
      var subscription = message.subscription,
          msgToken     = message.ext && message.ext.authToken;

      console.log(subscription);
      console.log(msgToken);

      // Add an error if the tokens don't match
      if ("rt6utrb" !== msgToken)
        message.error = 'Invalid subscription auth token';

      // Call the server back now we're done
      callback(message);
    }
  };

  bayeux.addExtension(serverAuth);
};