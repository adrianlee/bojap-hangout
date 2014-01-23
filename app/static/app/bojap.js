'use strict';

angular.module('bojap', ['ngRoute', 'ngResource'])

.config(function($routeProvider) {
  $routeProvider
    .when('/', { controller: 'Landing', templateUrl: 'landing.html' })
    .when('/hangout', { controller: 'Hangout', templateUrl: 'hangout.html' })
    .when('/messages', { controller: 'Landing', templateUrl: 'landing.html' })
    .when('/profile', { controller: 'Landing', templateUrl: 'landing.html' })
    .when('/login', { controller: 'Login', templateUrl: 'login.html' })
    .when('/logout', { controller: 'Logout', templateUrl: 'logout.html' })
    .otherwise({ redirectTo: '/' });
})

.run(function ($rootScope, $location, $http, User) {
  $rootScope.$on('$locationChangeStart', function (event, next, current) {
    if ($location.$$search && $location.$$search.token && $location.$$search.user) {
      User.login($location.$$search.user, $location.$$search.token);
      $location.$$search = {};
      $location.path(next.split('?')[0]);
    }

    if (!User.isAuthenticated && next.templateUrl == "logout.html") {
      return $location.path('/');
    }

    if (!User.isAuthenticated() && next.templateUrl != "login.html") {
      return $location.path('/login');
    }
  });
})
