var mongoose = require('mongoose');
var config = require('../config');

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

var UserSchema = {
  displayName: String,
  email: { type: String, select: false },
  google:  { type: GoogleProviderSchema, select: false }
};

var UserModel = mongoose.model('User', UserSchema);

var MessageSchema = {
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
};

var MessageMoodel = mongoose.model('Message', MessageSchema);

module.exports = {
  User: UserModel,
  Message: MessageMoodel
};