'use strict';

angular.module('bojap')
.factory('accountService', function($q, $http, Base64) {
  var self = this;

  this.authenticated = false;
  this.token = null;
  this.profile = {};


  
  if (getToken()) {
    this.token = getToken();
    this.authenticated = true; 
    $http.defaults.headers.common.Authorization = 'Basic ' + Base64.encode(getToken() + ':' + getToken());
  }

  function getToken() {
    return localStorage["token"];
  }

  function setToken(token) {
    self.authenticated = true;
    $http.defaults.headers.common.Authorization = 'Basic ' + Base64.encode(token + ':' + token);
    return localStorage["token"] = token;
  }

  function setProfile(profile) {
    self.profile = profile;
  }

  return {
    isAuthenticated: function() {
      return self.authenticated;
    },
    getName: function () {
      return self.name;
    },
    loginWithToken: function(user, token) {
      console.log("logged in as " + user);
      console.log("token: " + token); 

      if (!token) {
        return false;
      }

      setToken(token);
      
      self.token = token;

      return true;
    },
    loginWithPassword: function (email, password) {
      var that = this;

      var deferred = $q.defer();

      $http({
        method: 'GET',
        url: 'http://api.bojap.dev/login',
        params: {
          email: email,
          password: password
        }
      })
      .success(function(data, status, headers, config) {
        setToken(data.token);
        setProfile(data.payload);
        
        deferred.resolve(data);
      })
      .error(function (data, status, headers, config) {
        deferred.reject(data);
      });

      return deferred.promise;
    },
    logout: function () {
      self.token = null;
      self.profile = {};

      // setToken(null);
      localStorage.clear();
      $http.defaults.headers.common.Authorization = null;

      self.authenticated = false;
      
      return true; 
    },
    getProfile: function () {
      var deferred = $q.defer();

      $http({
        method: 'GET',
        url: 'http://api.bojap.dev/users/me'
      }).
      success(function(data, status, headers, config) {
        self.profile = data;
        deferred.resolve(data);
      }).
      error(function(data, status, header, config) {
        deffered.reject(data);
      });

      return deferred.promise;
    }
  }
});