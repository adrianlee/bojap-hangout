'use strict';

angular.module('bojap')
.controller('Logout', function ($location, accountService) {
  console.log("logging user out");
  if (accountService.logout()) {
    $location.path('/');
  }
});