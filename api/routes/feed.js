const router = require('express').Router();

const feedController = require('../controllers/feed');
const { isAuthenticated } = require('../middlewares/auth');

router.get('/home', isAuthenticated, feedController.getUserHomeFeed);

module.exports = router;
