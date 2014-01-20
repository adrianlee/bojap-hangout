'use strict';

angular.module('bojap', ['ngRoute', 'ngResource'])

.config(function($routeProvider) {
  $routeProvider
    .when('/', { controller: 'Landing', templateUrl: 'landing.html' })
    .when('/hangout', { controller: 'Hangout', templateUrl: 'hangout.html' })
    .when('/messages', { controller: 'Landing', templateUrl: 'landing.html' })
    .when('/profile', { controller: 'Landing', templateUrl: 'landing.html' })
    .when('/settings', { controller: 'Landing', templateUrl: 'landing.html' })
    .when('/feedback', { controller: 'Landing', templateUrl: 'landing.html' })
    .when('/login', { controller: 'Login', templateUrl: 'login.html' })
    .when('/logout', { controller: 'Logout', templateUrl: 'logout.html' })
    .otherwise({ redirectTo: '/' });
})

.run(function ($rootScope, $location, User) {
  $rootScope.$on('$locationChangeStart', function (event, next, current) {
    if ($location.$$search && $location.$$search.token && $location.$$search.user) {
      User.login($location.$$search.user, $location.$$search.token);
      $location.$$search = {};
      $location.path(next.split('?')[0]);
    }

    if (!User.isAuthenticated && next.templateUrl == "logout.html") {
      return $location.path('/');
    }

    if (!User.isAuthenticated() && next.templateUrl != "login.html") {
      return $location.path('/login');
    }
  });
})

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
  client.disable('websocket');

  return {
    client: client
  }
})

.controller('Main', function ($scope, $location, User, Faye) {
  $scope.loggedIn = User.isAuthenticated;

  Faye.client.subscribe('/messages', function(message) {
    alert('Got a message: ' + message.text);
  });

  if ($scope.loggedIn) {
    console.log(User.isAuthenticated());
  }

  // Side Menu
  $(function() {
    $('#menuLink').click(function (e) {
      e.preventDefault();
      $('#layout').toggleClass('active');
      e.stopPropagation();
    });

    // $('#nav li').click(function (e) {
    //   // setTimeout(function() {
    //     $('#layout').removeClass('active');
    //   // }, 200);
    // });

    $(document).click(function (e) {
      if ($('#layout').hasClass('active')) {
        $('#layout').removeClass('active');
      }
    });
  });
})

.controller('Login', function ($scope, $location, User) {
  $scope.message = 'Hello Anonymous, Please Log in';
})

.controller('Logout', function ($location, User) {
  console.log("logging user out");
  if (User.logout()) {
    $location.path('/');
  }
})

.controller('Hangout', function ($scope) {
  $(function () {
      gapi.hangout.render('start_hangout', {
          'render': 'createhangout',
          'topic': "Adrian's Room",
          'hangout_type': 'normal',
          'initial_apps': [],
          'widget_size': 175
      });
  });

  fetchRooms();
  setInterval(fetchRooms, 10000);

  function fetchRooms() {
    $.get("http://api.bojap.com/rooms", function (data) {
      if (!data) return false;
      // console.log("rooms online: " + data.length);
      var list = document.getElementById("list_rooms");
      var html = "";

      for (var i in data) {
          html += "<tr>";
          html += "<td>" + data[i].local_participant.person.displayName + "</td>";
          html += "<td>" + data[i].topic + "</td>";
          html += "<td>" + data[i].participants.length + "/8</td>";
          // html += "<td>" + "online" + "</td>";
          html += "<td>" + "<a class='button pure-button pure-button-xsmall pure-button-secondary' href='" + data[i].url + "' target='_blank'>join</a>" + "</td>";
          html += "</tr>";
      }

      list.innerHTML = html;
    });
  }
})

.controller('Landing', function ($scope, $route) {

  $scope.message = "Hello User";

  $scope.templates = {
    welcome: "welcome.html",
    messages: "messages.html",
    profile: "profile.html",
    settings: "settings.html",
    feedback: "feedback.html"
  };

  $scope.changeTemplate = function (template) {
    $scope.template = $scope.templates[template];
  };

  $scope.template = $scope.templates[$route.current.$$route.originalPath.substring(1)] || $scope.templates.welcome;
})

.controller('Welcome', function ($scope, Faye) {
  $scope.message = {};

  $scope.send = function (message) {
    Faye.client.publish('/' + message.channel, {
      sender: '123',
      text: message.data
    });
  }
})

.controller('Message', function ($scope, $http) {
  $scope.master = {};

  // Fetch Existing Messages
  $scope.fetch = function () {
    $http.get('http://api.bojap.com/messages')
    .success(function (d) {
      console.log(d);
      $scope.messages = angular.copy(d);
    })
    .error(function (d) {
      console.log(d);
    });
  }

  $scope.fetch();

  // Compose Form Send
  $scope.send = function (input) {
    console.log(input);

    $http.post('http://api.bojap.com/messages', {
      users: input.recipient,
      subject: input.subject,
      message: input.message
    })
    .success(function (d) {
      console.log(d);

      // success
      $('#compose').toggle();
      $scope.reset();
    })
    .error(function (d) {
      console.log(d);
    });

  };

  // Compose Form Reset
  $scope.reset = function () {
    $scope.input = angular.copy($scope.master);
  }
})

.controller('Profile', function ($scope) {
  if ($scope.loggedIn()) {
    $scope.profile = "User"
  } else {
    $scope.profile = "Profile not found. Are you logged in?";
  }

  // $scope.input = angular.copy($scope.bojap.user)
})

.controller('Settings', function ($scope) {

})

.controller('Feedback', function ($scope) {
  $scope.master = {};
  
  $scope.send = function (feedback) {
    console.log(feedback);

    $scope.reset();
  };

  $scope.reset = function () {
    $scope.feedback = angular.copy($scope.master);
  }
});