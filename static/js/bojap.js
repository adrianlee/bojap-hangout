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

