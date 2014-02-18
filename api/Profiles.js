var db = require('../core/db');

var Profiles = {};

// Permissions: public
Profiles.list = function (req, res) {
  db.Profile.find()
  .populate({ path: 'user' })
  .exec(function (err, profiles) {
    if (err) return res.send(400, { message: "Something went wrong", error: err });
    res.send(200, profiles);
  });
};

// Permissions: public
Profiles.read = function (req, res) {
  var id = req.param('id');

  if (!id) return res.send(400, { message: "Specify an ID" });
  
  // validate input
  if (id == "me") {
    id = req.user && req.user._id;
  }

  db.Profile.findOne({ _id: id })
  .populate({ path: 'user' })
  .exec(function (err, profile) {
    if (err) return res.send(400, { message: "Most likely invalid id", error: err });

    res.send(200, profile);
  });
};

// Permissions: self
Profiles.create = function (req, res) {
  // var newProfile = new db.Profile({
  //   user: req.user._id
  // });

  // newProfile.save(function (err, profile) {
  //   if (err) return res.send(400, { message: "Save Error", error: err });

  //   res.send(201, profile); 
  // });
};

// Permissions: self
Profiles.update = function (req, res) {
  res.send(501);
};

// Permissions: admin
Profiles.remove = function (req, res) {
  res.send(501);
};

module.exports = Profiles;