'use strict';

angular.module('bojap')
.factory('accountService', function($http, Base64) {
  var self = this;

  this.authenticated = false;
  this.user = null;
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
      
      self.user = user;
      self.token = token;

      return true;
    },
    loginWithPassword: function (email, password, cb) {
      var that = this;
      $http({
        method: 'POST',
        url: 'http://api.bojap.dev/user.login',
        data: {
          email: email,
          password: password
        }
      }).
      success(function(data, status, headers, config) {
        if (data.error) {
          return cb(data);
        }

        setToken(data.token);
        that.setProfile(data.payload);

        cb(null, data);
      });
    },
    logout: function () {
      self.user = null;
      self.token = null;

      // setToken(null);
      localStorage.clear();
      $http.defaults.headers.common.Authorization = null;

      if (self.authenticated) {
        self.authenticated = false;
        return true;
      }
      return false; 
    },
    getProfile: function (cb) {
      $http({
        method: 'POST',
        url: 'http://api.bojap.dev/user.get',
        data: {
          id: 'me'
        }
      }).
      success(function(data, status, headers, config) {
        cb(data.error ? data : null, data.payload);
      });
    },
    setProfile: function (profile) {
      $rootScope.profile = profile;
    }
  }
});