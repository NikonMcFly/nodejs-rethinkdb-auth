var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var config = require('../config/config');
var checkToken = expressJwt({ secret: config.secrets.jwt });
var User = require('../api/user/userModel');


exports.decodeToken = function() {
  return function(req, res, next) {

    if (req.query && req.query.hasOwnProperty('access_token')) {
      req.headers.authorization = 'Bearer ' + req.query.access_token;
    }

    checkToken(req, res, next);
  };
};

exports.getFreshUser = function() {
  return function(req, res, next) {
    User.filter(req.user._id)
      .then(function(user) {
        if (!user) {

          res.status(401).send('Unauthorized');
        } else {
          // update req.user with fresh user from
          // stale token data
          req.user = user;
          next();
        }
      }, function(err) {
        next(err);
      });
  }
};

exports.verifyUser = function() {
  return function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    // if no username or password then send
    if (!username || !password) {
      res.status(400).send('You need a username and password');
      return;
    }

    // find user in the DB to check
    // if the passwords match for the username
    User.filter({username: username}).run()
      .then(function(user) {
        if (!user) {
          res.status(401).send('No user with the given username');
        } else {
          // checking the passwords
          if (!user.authenticate(password)) {
            res.status(401).send('Wrong password');
          } else {

            req.user = user;
            next();
          }
        }
      }, function(err) {
        next(err);
      });
  };
};

// util method to sign tokens on signup
exports.signToken = function(id) {
  return jwt.sign(
    {_id: id},
    config.secrets.jwt,
    {expiredMinutes: config.expiresIn}
  );
};
