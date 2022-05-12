const router = require('express').Router();

const { isAuthenticated } = require('../middlewares/auth');
const tweetController = require('../controllers/tweet');

router.post('/create-tweet', isAuthenticated, tweetController.createTweet);

module.exports = router;
