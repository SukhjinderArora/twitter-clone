const router = require('express').Router();
const { checkSchema } = require('express-validator');

const { isAuthenticated, validateRequest } = require('../middlewares/auth');
const postController = require('../controllers/post');
const { newPostSchema } = require('../services/validators');

router.post(
  '/create-post',
  isAuthenticated,
  checkSchema(newPostSchema),
  validateRequest,
  postController.createPost
);
router.post('/like', isAuthenticated, postController.likePost);
router.post('/repost', isAuthenticated, postController.repostPost);

module.exports = router;
