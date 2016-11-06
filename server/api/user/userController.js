var User = require('./userModel');
var r = require('rethinkdb');
var signToken = require('../../auth/auth').signToken;


exports.get = function(req, res, next) {
  //find user
  r.table('users').tableCreate('author').run(req, function(err, cursor) {
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
 /*
 connect to database and post username password
 to database. And add tokens and username
 */
 r.table('users').tableCreate('user').run(function(err, cursor) {
   var newUser = new User(req.body);

   newUser.save(function(err, user) {
     if(err) {
       return next(err);
     }

     var token = signToken(user._id);
     res.json({token: token});
   });
 })

};

exports.delete = function(req, res, next){
  var id = req.params.id;
  User.get(id).delete().run().then(function(error, result){
    console.log("deleted user")
  })

}
