var db = require('../core/db');

var Profiles = {};

// Permissions: public
Profiles.list = function (req, res) {
  res.send(501);
};

// Permissions: public
Profiles.read = function (req, res) {
  res.send(501);
};

// Permissions: self
Profiles.create = function (req, res) {
  res.send(501);
};

// Permissions: self
Profiles.update = function (req, res) {
  res.send(501);
};

// Permissions: admin
Profiles.remove = function (req, res) {
  res.send(501);
};

module.exports = Profiles;