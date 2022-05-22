const router = require('express').Router();

const userController = require('../controllers/user');
const { isValidUser, isAuthenticated } = require('../middlewares/auth');

router.get('/:username', userController.getUserByUsername);
router.get('/:id/posts', isValidUser, userController.getAllPostsByUser);
router.get(
  '/:id/posts/liked',
  isValidUser,
  userController.getAllLikedPostsByUser
);
router.patch('/follow', isAuthenticated, userController.followUser);
router.patch('/unfollow', isAuthenticated, userController.unFollowUser);

module.exports = router;
