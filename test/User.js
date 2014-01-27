"use strict";

var should = require('should'),
  request = require("request");

describe('User', function() {
  var fakeUserID;
  var fakeUserToken;

  // User.save - create
  describe('save() to create', function() {
    it('should fail with no POST data', function(done) {
      var options = {
        url: "http://localhost:8011/user.save",
        json: true
      };

      request.post(options, function(err, res, body) {
        res.statusCode.should.equal(200);
        body.should.have.property('error', 400);
        body.should.have.property('payload');
        done();
      });
    });

    it('should pass without all required data of fake user', function(done) {
      var options = {
        url: "http://localhost:8011/user.save",
        json: {
          displayName: "world",
          password: "omg"
        }
      };

      request.post(options, function(err, res, body) {
        res.statusCode.should.equal(200);
        body.should.have.property('error', 400);
        body.should.have.property('payload');
        done();
      });
    });

    it('should pass with all required data of fake user', function(done) {
      var options = {
        url: "http://localhost:8011/user.save",
        json: {
          displayName: "world",
          email: "fake.email@gmail.com",
          password: "omg"
        }
      };

      request.post(options, function(err, res, body) {
        fakeUserID = body.payload._id;

        res.statusCode.should.equal(200);
        body.should.have.property('success', 201);
        body.should.have.property('payload');


        done();
      });
    });

    it('should fail creating the same fake user', function(done) {
      var options = {
        url: "http://localhost:8011/user.save",
        json: {
          displayName: "world",
          email: "fake.email@gmail.com",
          password: "omg"
        }
      };

      request.post(options, function(err, res, body) {
        res.statusCode.should.equal(200);
        body.should.have.property('error', 400);
        body.should.have.property('payload');
        done();
      });
    });
  });
  
  // User.get
  describe('get()', function() {
    it('should fail to get user without id', function(done) {
      var options = {
        url: "http://localhost:8011/user.get",
        json: true
      };

      request.get(options, function(err, res, body) {
        res.statusCode.should.equal(200);
        body.should.have.property('error', 400);
        body.should.have.property('message', 'ID field missing');
        done();
      });
    });

    it('should pass to get fake user with saved id', function(done) {
      var options = {
        url: "http://localhost:8011/user.get",
        json: {
          id: fakeUserID
        }
      };

      request.get(options, function(err, res, body) {
        res.statusCode.should.equal(200);
        body.should.have.property('success', 200);
        body.should.have.property('payload');
        done();
      });
    });
  });

  // User.save - edit
  describe('save() to edit', function() {
    it('should not be able to edit non valid id', function(done) {
      var options = {
        url: "http://localhost:8011/user.save",
        json: {
          id: "asdfg"
        }
      };

      request.post(options, function(err, res, body) {
        res.statusCode.should.equal(200);
        body.should.have.property('error', 400);
        body.should.have.property('message', "ID field not an ObjectId");
        done();
      });
    });

    it('should not be able to edit non existent user', function(done) {
      var options = {
        url: "http://localhost:8011/user.save",
        json: {
          id: "52e56f170762f5201a05e7ca",
          displayName: "OMG"
        }
      };

      request.post(options, function(err, res, body) {
        res.statusCode.should.equal(200);
        body.should.have.property('error', 404);
        body.should.have.property('message', "User not found");
        done();
      });
    });

    xit('should not be able to edit another user', function(done) {

    });

    it('should be able to edit fake user', function(done) {
      var options = {
        url: "http://localhost:8011/user.save",
        json: {
          id: fakeUserID,
          displayName: "Hello"
        }
      };

      request.post(options, function(err, res, body) {
        res.statusCode.should.equal(200);
        body.should.have.property('success', 200);
        body.should.have.property('payload');
        body.payload.should.have.property('displayName', 'Hello');
        done();
      });
    });
  });

  // User.login
  describe('login()', function() {
    it('should not be able to login without credentials', function(done) {
      var options = {
        url: "http://localhost:8011/user.login",
        json: {}
      };

      request.post(options, function(err, res, body) {
        res.statusCode.should.equal(200);
        body.should.have.property('error', 403);
        done();
      });
    });

    it('should not be able to login without password', function(done) {
      var options = {
        url: "http://localhost:8011/user.login",
        json: {
          email: "jun.irok@gmail.com",
          password: null
        }
      };

      request.post(options, function(err, res, body) {
        res.statusCode.should.equal(200);
        body.should.have.property('error', 403);
        done();
      });
    });

    it('should be able to login with fake user credentials', function(done) {
      var options = {
        url: "http://localhost:8011/user.login",
        json: {
          email: "fake.email@gmail.com",
          password: "omg"
        }
      };

      request.post(options, function(err, res, body) {
        res.statusCode.should.equal(200);
        body.should.have.property('success', 200);
        body.should.have.property('payload');
        body.should.have.property('token');
        fakeUserToken = body.token; // save token
        done();
      });
    });
  });

  // User.logout
  describe('logout()', function() {
    it('should fail with wrong token', function(done) {
      var options = {
        url: "http://localhost:8011/user.logout",
        json: true
      };

      request(options, function(err, res, body) {
        res.statusCode.should.equal(200);
        body.should.have.property('error', 404);
        done();
      });
    });

    xit('should be able to logout', function(done) {
      var options = {
        url: "http://localhost:8011/user.logout",
        json: true
      };

      request(options, function(err, res, body) {
        res.statusCode.should.equal(200);
        body.should.have.property('success', 200);
        done();
      });
    });
  });

  // User.remove
  describe('remove()', function() {
    it('should be able to remove fake user', function(done) {
      var options = {
        url: "http://localhost:8011/user.remove",
        json: {
          id: fakeUserID
        }
      };

      request.post(options, function(err, res, body) {
        res.statusCode.should.equal(200);
        body.should.have.property('success', 200);
        body.should.have.property('payload');
        done();
      });
    });
  });

});