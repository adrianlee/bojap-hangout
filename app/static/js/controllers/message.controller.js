'use strict';

angular.module('bojap')
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
});