const express = require('express');
const { checkSchema } = require('express-validator');

const authController = require('../controllers/auth');
const {
  generateAuthTokens,
  validateRequest,
  isAuthenticated,
} = require('../middlewares/auth');
const { signupSchema } = require('../services/validators');

const router = express.Router();

router.post('/login/password', authController.login, generateAuthTokens);

router.post(
  '/signup/validate-email',
  checkSchema(signupSchema.validateEmail),
  validateRequest,
  authController.signup.validateEmail
);
router.post(
  '/signup/create-user',
  checkSchema({
    ...signupSchema.validateEmail,
    ...signupSchema.validatePassword,
  }),
  validateRequest,
  authController.signup.createUser,
  generateAuthTokens
);
router.patch(
  '/signup/update-username',
  isAuthenticated,
  checkSchema(signupSchema.validateUsername),
  validateRequest,
  authController.signup.updateUsername
);

module.exports = router;
