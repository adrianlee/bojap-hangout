'use strict';

angular.module('bojap')
.controller('Settings', function ($rootScope, $scope, accountService) {
  // async fetch new profile. use existing profile temporarily
  $scope.input = $rootScope.profile || {};
  
  accountService.getProfile(function (err, profile) {
    if (err) return false;
    $rootScope.profile = profile;
    $scope.input = profile;
  });
  
  // save changes
  $scope.save = function (input) {
    console.log(input);
  };

  // when navigating away, ask to save changes
});