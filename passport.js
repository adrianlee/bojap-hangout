var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

module.exports = function(passport) {

  // Called once after Oauth success.
  passport.serializeUser(function(user, done) {
    console.log("serializeUser");
    done(null, user);
  });

  // After login. This is called every request.
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });


  /*
   * Google
   */
  passport.use(new GoogleStrategy({
      clientID: "757506080096-eesi3shfiu87qiqeqpa1bj439si4uhga.apps.googleusercontent.com",
      clientSecret: 'xZ7-TJAdSSGR_YwciqodSa_P',
      callbackURL: "http://localhost:8080/auth/google/callback"
    },
    function(token, refreshToken, profile, done) {
      // User.findOrCreate({ openId: identifier }, function(err, user) {
      //   done(err, user);
      // });

      process.nextTick(function() {
        console.log(token);
        console.log(refreshToken);
        console.log(profile);
        done(null, profile);
      });      
    }
  ));

};
