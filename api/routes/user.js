const { checkSchema } = require('express-validator');
const router = require('express').Router();

const userController = require('../controllers/user');
const { isAuthenticated, validateRequest } = require('../middlewares/auth');
const { profileSchema } = require('../services/validators');

router.get('/:username', userController.getUserByUsername);
router.get('/:id/posts', userController.getPostsByUser);
router.get('/:id/posts/liked', userController.getLikedPostsByUser);
router.patch('/follow', isAuthenticated, userController.followUser);
router.patch('/unfollow', isAuthenticated, userController.unFollowUser);
router.get('/:id/followers', isAuthenticated, userController.getFollowersList);
router.get('/:id/followees', isAuthenticated, userController.getFolloweesList);
router.get('/:id/posts/replies', userController.getRepliesByUser);
router.put(
  '/my/profile/',
  isAuthenticated,
  checkSchema(profileSchema),
  validateRequest,
  userController.updateProfile
);
router.get('/me', isAuthenticated, userController.getAuthUserInfo);

module.exports = router;
