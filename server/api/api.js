var router = require('express').Router();

//connect all api endpoints
router.use('/users', require('./user/userRoutes'));

module.exports = router;
