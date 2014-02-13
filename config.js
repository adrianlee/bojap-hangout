exports.app = {};
exports.app.port = 8010;

exports.api = {};
exports.api.port = 8011;

exports.redis = {};
exports.redis.port = 6379;
exports.redis.host = "bojap.com";
exports.redis.pass = "bojappassword";

exports.mongohqURI = "mongodb://adrian:mongopassword@paulo.mongohq.com:10045/hangout";

exports.jwtSecret = "omg wtf bbq bojap ftw awesome legit";

exports.GoogleStrategy = {};
exports.GoogleStrategy.clientID = "692122391406-gjftvker6cnq0ab54fd7jq9h7popfn76.apps.googleusercontent.com";
exports.GoogleStrategy.clientSecret = "uPo1RwT95KrFgfczCL3VXTZ3";
exports.GoogleStrategy.callbackURL = "http://app.bojap.com/auth/google/callback";

exports.env = process.env.NODE_ENV || process.argv[3] || "dev";

exports.prod = {};
exports.dev = {};


exports.admins = ['52d4d1869b260aec199501f6'];