'use strict';

angular.module('bojap')
.controller('Login', function ($scope, $location, accountService) {
  $scope.showError = function () {
    return;
  };

  $scope.login = function (input) {
    if (!input) return false;
    if (!input.email || !input.password) return alert("Enter a valid email and password ");

    accountService.loginWithPassword(input.email, input.password)
    .then(function (result) {
      console.log("Logged in:", result);
      
      // redirect to welcome page
      $location.path('/welcome');
    }, function (err) {
      console.log(err);
    });
  };

  $scope.signup = function (input) {
    if (!input) return false;
    if (!input.email || !input.password) return alert("Enter a valid email and password ");


    console.log(input);
  };
})