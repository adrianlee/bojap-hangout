angular.module('app', ['ngRoute'])

.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      controller: 'LandingCtrl',
      templateUrl: 'landing.html'
    })
    .when('/hangout', {
      controller: 'HangoutCtrl',
      templateUrl: 'hangout.html'
    })
    .otherwise({
      redirectTo:'/'
    });
})

.controller('MainCtrl', function ($scope) {
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

.controller('HangoutCtrl', function ($scope) {
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


.controller('LandingCtrl', function ($scope) {
  if ($scope.bojap.loggedIn) {
    $scope.message = "Hello " + $scope.bojap.user.displayName;
  } else {
    $scope.message = 'Hello Anonymous, Please Log in';
  }
});