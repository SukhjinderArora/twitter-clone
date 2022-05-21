const router = require('express').Router();

const userController = require('../controllers/user');
const { isValidUser } = require('../middlewares/auth');

router.get('/:username', userController.getUserByUsername);
router.get('/:id/posts', isValidUser, userController.getAllPostsByUser);
router.get(
  '/:id/posts/liked',
  isValidUser,
  userController.getAllLikedPostsByUser
);

module.exports = router;
