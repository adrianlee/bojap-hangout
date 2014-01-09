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
        console.log(refreshToken);
        console.log(profile);
        done(null, profile);
      });      
    }
  ));

};