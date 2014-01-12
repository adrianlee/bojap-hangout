var mongoose = require('mongoose');

var UserSchema = {
  id: String,
  displayName: String,
  gender: String,
  locale: String
};

var UserModel = mongoose.model('User', UserSchema);

module.exports = {
  User: UserModel
};