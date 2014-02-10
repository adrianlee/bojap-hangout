'use strict';

angular.module('bojap')
.controller('Welcome', function ($scope, $resource) {
  var Health = $resource('http://api.bojap.com/health');
  $scope.health = Health.get({}, function() {
    console.log($scope.health);
  });
});