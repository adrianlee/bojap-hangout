angular.module('app', ['ngRoute'])

.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      controller: 'LandingCtrl',
      templateUrl: 'landing.html'
    })
    .when('/app', {
      controller: 'AppCtrl',
      templateUrl: 'app.html'
    })
    .otherwise({
      redirectTo:'/'
    });
})

.controller('MainCtrl', function ($scope) {
  $scope.bojap = window.bojap;

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
      $.get("/rooms", function (data) {
          // console.log("rooms online: " + data.length);
          var list = document.getElementById("list_rooms");
          var html = "";

          for (var i in data) {
              html += "<tr>";
              html += "<td>" + data[i].local_participant.person.displayName + "</td>";
              html += "<td>" + data[i].topic + "</td>";
              html += "<td>" + data[i].participants.length + "</td>";
              html += "<td>" + "online" + "</td>";
              html += "<td>" + "<a href='" + data[i].url + "' target='_blank'>join</a>" + "</td>";
              html += "</tr>";
          }

          list.innerHTML = html;
      });
  }
})

.controller('AppCtrl', function ($scope) {
  $scope.message = "Signed In!";
})


.controller('LandingCtrl', function ($scope) {
  if ($scope.bojap.loggedIn) {
    $scope.message = 'You are already logged in.';
  } else {
    $scope.message = 'Please Log in';
  }
});

