var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var db = require('./db');
var config = require('../config');

module.exports = function(passport) {

  /*
   * Passport Google Strategy
   * Create or Fetch user account. Save user and token to Redis for REST API.
   */
  passport.use(new GoogleStrategy(config.GoogleStrategy,
    function(token, refreshToken, profile, done) {
      process.nextTick(function() {

        // Fetch the user's ID and Profile
        db.User.findOne({ "google.id": profile.id }, function (err, user) {
          // If Account doesn't exist
          if (!user) {
            // Create new yser
            var newUser = new db.User({
              displayName: profile._json.given_name,
              google: profile._json,
              email: profile._json.email
            });

            // Save to Mongo
            newUser.save(function (err, savedUser) {
              if (err) return done(err, false);

              done(err, { token: token, user: savedUser._id, profile: profile._json });
            });
          } else {
            // If account exists
            done(err, { token: token, user: user });
          }
        });
      });      
    }
  ));
};
