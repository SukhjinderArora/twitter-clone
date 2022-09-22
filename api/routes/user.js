const { checkSchema } = require('express-validator');
const multer = require('multer');
const router = require('express').Router();

const { InvalidFileTypeError } = require('../utils/errors');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024,
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    const imageMimeType = /image\/(png|jpg|jpeg)/i;
    if (!file.mimetype.match(imageMimeType)) {
      cb(new InvalidFileTypeError('Invalid file type'));
      return;
    }
    cb(null, true);
  },
}).single('profile_image');

const userController = require('../controllers/user');
const { isAuthenticated, validateRequest } = require('../middlewares/auth');
const {
  profileSchema,
  signupSchema: { validateUsername, validateDateOfBirth },
  emailSchema,
} = require('../services/validators');

router.get('/user/:username', userController.getUserByUsername);
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
  (req, res, next) => {
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          errors: [
            {
              msg: 'File size too large. File should be less than 1MB',
              param: 'profile_image',
            },
          ],
        });
      }
      if (err instanceof InvalidFileTypeError) {
        return res.status(400).json({
          errors: [
            {
              msg: 'Invalid file type. Only .jpg, .png, and .jpeg files are allowed',
              param: 'profile_image',
            },
          ],
        });
      }
      if (err) {
        return next(err);
      }
      return next();
    });
  },
  checkSchema(profileSchema),
  validateRequest,
  userController.updateProfile
);
router.patch(
  '/my/username',
  isAuthenticated,
  checkSchema(validateUsername),
  validateRequest,
  userController.updateUsername
);
router.patch(
  '/my/email',
  isAuthenticated,
  checkSchema(emailSchema),
  validateRequest,
  userController.updateEmail
);
router.patch(
  '/my/dob',
  isAuthenticated,
  checkSchema(validateDateOfBirth),
  validateRequest,
  userController.updateDateOfBirth
);
router.get('/me', isAuthenticated, userController.getAuthUserInfo);

module.exports = router;
