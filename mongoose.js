module.exports = function(mongoose) {
  var MONGOLAB_URI  = "mongodb://adrian:mongopassword@paulo.mongohq.com:10045/hangout";

  mongoose.connect(MONGOLAB_URI , function (err, res) {
    if (err) {
      console.log ('ERROR connecting to: ' + MONGOLAB_URI + '. ' + err);
    } else {
      console.log ('Succeeded connected to: ' + MONGOLAB_URI);
    }
  });
};