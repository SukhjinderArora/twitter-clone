const router = require('express').Router();
const { checkSchema } = require('express-validator');

const { isAuthenticated, validateRequest } = require('../middlewares/auth');
const { createNotification } = require('../middlewares/notification');
const postController = require('../controllers/post');
const { postSchema } = require('../services/validators');

router.post(
  '/create-post',
  isAuthenticated,
  checkSchema(postSchema),
  validateRequest,
  postController.createPost
);
router.post(
  '/like',
  isAuthenticated,
  postController.likePost,
  createNotification
);
router.post('/unlike', isAuthenticated, postController.unLikePost);
router.post(
  '/repost',
  isAuthenticated,
  postController.repostPost,
  createNotification
);
router.post('/repost/remove', isAuthenticated, postController.removeRepost);
router.post(
  '/reply',
  isAuthenticated,
  checkSchema({
    ...postSchema,
    postId: {
      notEmpty: {
        errorMessage: 'This is a mandatory field',
      },
    },
  }),
  validateRequest,
  postController.postReply,
  createNotification
);
router.get('/:id', postController.getPostById);
router.get('/:id/ancestors', postController.getAncestorPosts);
router.get('/:id/children', postController.getChildPosts);

module.exports = router;
