const router = require('express').Router();
const { checkSchema } = require('express-validator');

const { isAuthenticated, validateRequest } = require('../middlewares/auth');
const postController = require('../controllers/post');
const { postSchema } = require('../services/validators');

router.post(
  '/create-post',
  isAuthenticated,
  checkSchema(postSchema),
  validateRequest,
  postController.createPost
);
router.post('/like', isAuthenticated, postController.likePost);
router.post('/unlike', isAuthenticated, postController.unLikePost);
router.post('/repost', isAuthenticated, postController.repostPost);
router.post('/repost/remove', isAuthenticated, postController.removeRepost);
router.post(
  '/reply',
  isAuthenticated,
  checkSchema(postSchema),
  postController.postReply
);
router.get('/:id', postController.getPostById);

module.exports = router;
