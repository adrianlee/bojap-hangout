'use strict';

angular.module('app', ['ngRoute', 'ngResource'])

.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      controller: 'Landing',
      templateUrl: 'landing.html'
    })
    .when('/hangout', {
      controller: 'Hangout',
      templateUrl: 'hangout.html'
    })
    .when('/messages', {
      controller: 'Landing',
      templateUrl: 'landing.html'
    })
    .when('/profile', {
      controller: 'Landing',
      templateUrl: 'landing.html',
    })
    .when('/settings', {
      controller: 'Landing',
      templateUrl: 'landing.html',
    })
    .when('/feedback', {
      controller: 'Landing',
      templateUrl: 'landing.html',
    })
    .otherwise({
      redirectTo:'/'
    });
})

.controller('Main', function ($scope) {
  // Fetch server passed object
  $scope.bojap = window.bojap;

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
    $.get("/api/rooms", function (data) {
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
  if ($scope.bojap.loggedIn) {
    $scope.message = "Hello " + $scope.bojap.user.displayName;
  } else {
    $scope.message = 'Hello Anonymous, Please Log in';
  }

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

.controller('Welcome', function ($scope) {

})

.controller('Message', function ($scope, $http) {
  $scope.master = {};

  // Fetch Existing Messages
  $scope.fetch = function () {
    $http.get('/api/messages')
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

    $http.post('/api/messages', {
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
  if ($scope.bojap.loggedIn) {
    $scope.profile = $scope.bojap.user;
  } else {
    $scope.profile = "Profile not found. Are you logged in?";
  }

  $scope.input = angular.copy($scope.bojap.user)
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