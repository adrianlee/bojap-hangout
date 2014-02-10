'use strict';

angular.module('bojap')
.controller('Landing', function ($scope, $route) {
  $scope.message = "Hello User";

  $scope.templates = {
    welcome: "templates/welcome.html"
  };

  $scope.changeTemplate = function (template) {
    $scope.template = $scope.templates[template];
  };

  // default to welcome page
  $scope.template = $scope.templates[$route.current.$$route.originalPath.substring(1)] || $scope.templates.welcome;
});