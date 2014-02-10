'use strict';

var app = angular.module('bojap', ['ngRoute', 'ngResource'])

.config(function($routeProvider) {
  $routeProvider
    .when('/', { controller: 'Landing', templateUrl: 'templates/landing.html' })
    .when('/hangout', { controller: 'Hangout', templateUrl: 'templates/hangout.html' })
    .when('/messages', { controller: 'Landing', templateUrl: 'templates/messages.html' })
    .when('/profile', { controller: 'Landing', templateUrl: 'templates/profile.html' })
    .when('/login', { controller: 'Login', templateUrl: 'templates/login.html' })
    .when('/logout', { controller: 'Logout', templateUrl: 'templates/logout.html' })
    .otherwise({ redirectTo: '/' });
})

.run(function ($rootScope, $location, $http, accountService) {
  $rootScope.$on('$locationChangeStart', function (event, next, current) {
    if ($location.$$search && $location.$$search.token && $location.$$search.user) {
      accountService.loginWithToken($location.$$search.user, $location.$$search.token);
      $location.$$search = {};
      $location.path(next.split('?')[0]);
    }

    if (!accountService.isAuthenticated && next.templateUrl == "logout.html") {
      return $location.path('/');
    }

    if (!accountService.isAuthenticated() && next.templateUrl != "login.html") {
      return $location.path('/login');
    }
  });

  // are we logged in?
  $rootScope.loggedIn = accountService.isAuthenticated;

  // get profile
  $rootScope.account = {};

  if ($rootScope.loggedIn()) {
    accountService.getProfile(function (err, profile) {
      if (err) return false;

      console.log(profile.payload);
      $rootScope.profile = profile.payload;
      $rootScope.apply();
    });
  }
})
