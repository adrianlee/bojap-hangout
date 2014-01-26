"use strict";

var mongoose = require('mongoose');
var config = require('../config');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var db = {};

mongoose.connect(config.mongohqURI, function (err, res) {
  if (err) {
    console.log ('ERROR connecting to: ' + config.mongohqURI + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + config.mongohqURI);
  }
});

var GoogleProviderSchema = {
  id: String,
  email: String,
  verified_email: Boolean,
  name: String,
  given_name: String,
  family_name: String,
  link: String,
  gender: String,
  locale: String
};

// Schemas
var UserSchema = new mongoose.Schema({
  displayName: { type: String, required: true },
  email: { type: String, select: false, required: true, unique: true },
  google:  { type: GoogleProviderSchema, select: false },
  password: { type: String, select: false, required: true },
  updated_at: { type: Date, default: Date.now },
  created_at: { type: Date, default: Date.now }
});

UserSchema.pre('save', function(next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function(userPassword, cb) {
  bcrypt.compare(userPassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

var MessageSchema = new mongoose.Schema({
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  subject: String,
  messages: [
    {
      sender: { type: mongoose.Schema.Types.ObjectId, rel: 'User' },
      has_read: [{ type: mongoose.Schema.Types.ObjectId, rel: 'User' }],
      message: String,
      timestamp: { type: Date, default: Date.now }
    }
  ]
});

// Models
db.User = mongoose.model('User', UserSchema);
db.Message = mongoose.model('Message', MessageSchema);

module.exports = db;