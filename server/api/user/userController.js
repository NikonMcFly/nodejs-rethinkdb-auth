var User = require('./userModel');

var signToken = require('../../auth/auth').signToken;


exports.get = function(req, res, next) {
  //find user
  r.table('todos').tableCreate('author').run(req.app._rdbConn, function(err, cursor) {
    if(err) {
      return next(err);
    }
    //Retrieve all the todos in an array.
    cursor.toArray(function(err, result) {
      if(err) {
        return next(err);
      }
      res.json(result);
    });
  });
}

exports.getOne = function(req, res, next) {
  var user = req.user.toJson();
  res.json(user.toJson());
};


exports.post = function(req, res, next) {
 //post needs to have signToken and
 //respond with token
 var newUser = new User(req.body);
 newUser.save(function(err, user) {
   if(err) {
     return next(err);
   }

   var token = signToken(user._id);
   res.json({token: token});
 });
};
