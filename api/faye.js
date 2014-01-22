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

  function send() {
    bayeux.getClient().publish('/notifications/public', {
      text: new Date().getTime()
    });
  }

  send();
  setInterval(send, 10000);

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
      if ("rt6utrb2" !== msgToken)
        message.error = 'Invalid subscription auth token';

      // Call the server back now we're done
      callback(message);
    }
  };



  bayeux.addExtension({
    incoming: function(message, request, callback) {
      // console.log(request && request.headers.origin);
      // console.log(request && request.headers.host);
      if (request && request.headers.host !== 'api2s') {
        message.error = '403::Forbidden origin';
      }
      callback(message);
    }
  });

  bayeux.addExtension(serverAuth);
};