var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
      done(null, user);
  });

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
