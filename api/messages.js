var db = require('../core/db');

function getMessages(req, res) {
  var id = req.user && req.user._id;

  db.Message.find({users: id}).populate('users').exec(function (err, messages) {
    if (err) return res.send(500, err);

    // if (!messages) return res.send(404, "no messages for user " + id);
    
    for (var i = 0; i < messages.length; i++) {
      for (var j = 0; j < messages[i].users.length; j++) {
        var recipient = messages[i].users[j];

        // remove current user from recipient field
        if (id.equals(recipient._id)) {
          messages[i].users.splice(j, 1);
        }
      }
    }

    console.log(messages);

    res.send(messages || []);
  });
}

function postMessages(req, res) {
  var id = req.user && req.user._id;

  if (!id) {
    return res.send(401, "UNAUTHORIZED");
  }

  var obj = {
    users: [],
    subject: req.param("subject"),
    messages: [
      {
        sender: id,
        message: req.param("message"),
        has_read: [id]
      }
    ]
  };

  // add self
  obj.users.push(id);

  // add receipient
  var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");

  if (checkForHexRegExp.test(req.param("users"))) {
    obj.users.push(req.param("users"));
  } else {
    return res.send(400, "users not an objectId");
  }

  var message = new db.Message(obj);

  message.save(function (err, savedMessage) {
    if (err) {
      console.log(err);
      return res.send(500, err);
    }

    res.send(201, savedMessage)
  });

  // var newMessage = new db.Message({
  //   users: [id,, ]
  // });
}

module.exports = {
  getMessages: getMessages,
  postMessages: postMessages
};