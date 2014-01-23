angular.module('bojap')

.controller('Main', function ($scope, $location, User, Faye) {
  $scope.loggedIn = User.isAuthenticated;

  if ($scope.loggedIn) {
    console.log(User.isAuthenticated());
  }

  // Side Menu
  $(function() {
    // Toggle side menu
    $('#menuLink').click(function (e) {
      e.preventDefault();
      $('#layout').toggleClass('active');
      e.stopPropagation();
    });

    // Click anywhere to minimize side menu
    $(document).click(function (e) {
      if ($('#layout').hasClass('active')) {
        $('#layout').removeClass('active');
      }
    });
  });
})

.controller('Login', function ($scope, $location, User) {
  
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

.controller('Welcome', function ($scope, Faye, $resource) {
  var Health = $resource('http://api.bojap.com/health');
  $scope.health = Health.get({}, function() {
    console.log($scope.health);
  });
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
  // fetch user profile
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