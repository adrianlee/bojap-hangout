'use strict';

angular.module('bojap')
.controller('Profile', function ($rootScope, $scope, accountService) {
 accountService.getProfile(function (err, profile) {
    if (err) return false;
    $scope.input = profile;
 });
});

