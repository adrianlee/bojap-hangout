var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var db = require('./db');

module.exports = function(passport) {

  // Called once after Oauth success.
  passport.serializeUser(function(profile, done) {
    console.log("serializeUser");

    console.log(profile);

    db.User.findOne({ googleId: profile.id }, function (err, user) {
      if (err) return done(err);
      
      console.log(user);

      if (!user) {
        var newUser = new db.User({ googleId: profile.id, displayName: profile.displayName, email: profile._json.email, google: profile._json });
        newUser.save(function (err, newProfile) {
          if (err) return done(err);
          console.log("New Profile Created for " + newProfile.displayName);

          return done(null, newProfile.googleId);
        });
      } else {
        console.log("Profile found for " + user.displayName);
        console.log(user);
        return done(null, user.googleId);
      }
    });
  });

  // After login. This is called every request.
  // TODO: Instead of hitting mongo, hit redis, if not found then hit mongo.
  passport.deserializeUser(function(id, done) {
    console.log("deserializeUser");

    db.User.findOne({googleId: id}, function (err, profile) {
      // Error with db
      if (err) return done(err);

      // profile doesn't exist
      if (!profile) {
        return done(null, false);
      }

      // If profile exists
      return done(null, profile);
    });
  });


  /*
   * Google
   */
  passport.use(new GoogleStrategy({
      clientID: "692122391406-gjftvker6cnq0ab54fd7jq9h7popfn76.apps.googleusercontent.com",
      clientSecret: 'uPo1RwT95KrFgfczCL3VXTZ3',
      callbackURL: "http://app.bojap.com/auth/google/callback"
    },
    function(token, refreshToken, profile, done) {
      // User.findOrCreate({ openId: identifier }, function(err, user) {
      //   done(err, user);
      // });

      process.nextTick(function() {
        console.log(token);
        // console.log(profile);
        done(null, profile);
      });      
    }
  ));

};
