var db = require('../core/db');

function getById(req, res) {
  var id = req.user && req.user._id;

  db.User.findOne({_id: id}).select('+email').exec(function (err, user) {
    if (err) return res.send(500, err);

    if (!user) return res.send(404, "user not found");

    res.send(user);
  });
}

module.exports = {
  getById: getById
};