"use strict";

var should = require('should'),
  request = require("request");

describe('User', function() {
  var fakeUserID;

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

  });

  describe('save()', function() {
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