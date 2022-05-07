const express = require('express');
const { checkSchema } = require('express-validator');

const authController = require('../controllers/auth');
const {
  generateAuthTokens,
  validateRequest,
  isAuthenticated,
} = require('../middlewares/auth');
const { signupSchema, loginSchema } = require('../services/validators');

const router = express.Router();

router.post(
  '/login/password',
  checkSchema(loginSchema),
  authController.loginPassword,
  generateAuthTokens
);

router.post('/signup/google', authController.signupGoogle, generateAuthTokens);
router.post('/signin/google', authController.signupGoogle, generateAuthTokens);

router.post(
  '/signup/validate-email',
  checkSchema(signupSchema.validateEmail),
  validateRequest,
  authController.signupPassword.validateEmail
);
router.post(
  '/signup/create-user',
  checkSchema({
    ...signupSchema.validateEmail,
    ...signupSchema.validatePassword,
  }),
  validateRequest,
  authController.signupPassword.createUser,
  generateAuthTokens
);
router.patch(
  '/signup/update-dob',
  isAuthenticated,
  checkSchema(signupSchema.validateDateOfBirth),
  authController.signupPassword.updateDateOfBirth
);
router.patch(
  '/signup/update-username',
  isAuthenticated,
  checkSchema(signupSchema.validateUsername),
  validateRequest,
  authController.signupPassword.updateUsername
);

module.exports = router;
