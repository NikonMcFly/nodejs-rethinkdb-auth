var router = require('express').Router();
var logger = require('../../util/logger');
var controller = require('./userController');
var auth = require('../../auth/auth');
var checkUser = [auth.decodeToken(), auth.getFreshUser()];


// router.param('id', controller.params);

router.route('/')
  .get(controller.get)
  .post(controller.post)


module.exports = router;
