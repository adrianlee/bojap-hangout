angular.module('bojap')

.factory('User', function() {
  var self = this;

  this.authenticated = false;
  this.user = null;
  this.token = null;

  return {
    isAuthenticated: function() {
      return self.authenticated;
    },
    getName: function () {
      return self.name;
    },
    login: function(user, token) {
      self.user = user;
      self.token = token;
      self.authenticated = true;
      return true;
    },
    logout: function () {
      self.user = null;
      self.token = null;
      if (self.authenticated) {
        self.authenticated = false;
        return true;
      }
      return false;
    }
  }
})

.factory('Faye', function () {
  var self = this;

  var client = new Faye.Client('http://api.bojap.com/faye');
  // client.disable('websocket');

  var clientAuth = {
    incoming: function (message, callback) {
      // console.log("client incoming:");
      // console.log(message);
      // callback(message);
    },
    outgoing: function(message, callback) {
      // console.log("client outgoing:");
      // console.log(message);
      // Again, leave non-subscribe messages alone
      if (message.channel !== '/meta/subscribe')
        return callback(message);

      // Add ext field if it's not present
      if (!message.ext) message.ext = {};

      // Set the auth token
      message.ext.authToken = 'rt6utrb';

      // Carry on and send the message to the server
      callback(message);
    }
  };

  client.addExtension(clientAuth);

  return {
    client: client
  }
})

