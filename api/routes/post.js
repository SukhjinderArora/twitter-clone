const router = require('express').Router();

const { isAuthenticated } = require('../middlewares/auth');
const postController = require('../controllers/post');

router.post('/create-post', isAuthenticated, postController.createPost);

module.exports = router;
