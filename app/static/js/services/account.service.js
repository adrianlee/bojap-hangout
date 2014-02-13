'use strict';

angular.module('bojap')
.factory('accountService', function($http, Base64) {
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
        setProfile(data.payload);

        cb(null, data);
      });
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
    getProfile: function (cb) {
      $http({
        method: 'POST',
        url: 'http://api.bojap.dev/user.get',
        data: {
          id: 'me'
        }
      }).
      success(function(data, status, headers, config) {
        self.profile = data.payload;
        cb(data.error ? data : null, data.payload);
      });
    }
  }
});