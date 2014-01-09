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

})

.controller('AppCtrl', function ($scope) {
  $scope.message = "Signed In!";
})


.controller('LandingCtrl', function ($scope) {
  // create a message to display in our view
  $scope.loggedIn = bojap.loggedIn;
  
  if ($scope.loggedIn) {
    $scope.message = 'You are already logged in.';
  } else {
    $scope.message = 'Please Log in';
  }
});

