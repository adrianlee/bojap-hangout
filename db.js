var mongoose = require('mongoose');

var MONGOLAB_URI  = "mongodb://adrian:mongopassword@paulo.mongohq.com:10045/hangout";

mongoose.connect(MONGOLAB_URI , function (err, res) {
  if (err) {
    console.log ('ERROR connecting to: ' + MONGOLAB_URI + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + MONGOLAB_URI);
  }
});

var UserSchema = {
  displayName: String,
  emails: [{ value: String }],
  googleId: String,
  google: {
    id: String,
    email: String,
    verified_email: Boolean,
    name: String,
    given_name: String,
    family_name: String,
    link: String,
    gender: String,
    locale: String
  }
};

var UserModel = mongoose.model('User', UserSchema);

module.exports = {
  User: UserModel
};