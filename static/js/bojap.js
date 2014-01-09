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
  $scope.message = 'Everyone come and see how good I look!';
});

