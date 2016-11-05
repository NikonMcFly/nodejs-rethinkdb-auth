var router = require('express').Router();
var verifyUser = require('./auth').verifyUser;
var controller = require('./controller');

// check before jwt
// the password and username match what is in the DB
router.post('/signin', verifyUser(), controller.signin);

module.exports = router;
