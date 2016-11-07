var User = require('./userModel');
var r = require('rethinkdb');

var signToken = require('../../auth/auth').signToken;
var config = require('../../config/config');
var db_promise = r.connect({
    host: 'localhost',
    port: 28015
})

exports.get = function(req, res, next) {
  //find user
  db_promise.then(function(con){
    return r.table('user').run(con);
  }).then(function(cursor){
      cursor.toArray(function(err, result) {
        if(err) {
          return next(err);
        }
        res.json(result);
      });
  })
}

exports.getOne = function(req, res, next) {
  var user = req.user.toJson();
  res.json(user.toJson());
};


exports.post = function(req, res, next) {
/*
  Need to clean up code here
*/
 db_promise.then(function(con){
   return r.table('user').run(con);
 }).then(function(){
   var newUser = new User(req.body);
    newUser.save(function(err, user) {
      if(err) {
        return next(err);
      }
     var token = signToken(user._id);
     res.json({token: token});
    })
  })
}

exports.delete = function(req, res, next){
  var id = req.params.id;
  User.get(id).delete().run().then(function(error, result){
    console.log("deleted user")
  })

}
