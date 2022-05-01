const express = require('express');
const passport = require('passport');
const { checkSchema } = require('express-validator');

const authController = require('../controllers/auth');
const { generateAuthTokens, validateRequest } = require('../middlewares/auth');
const { signupSchema } = require('../services/validators');

const router = express.Router();

router.post(
  '/login/password',
  authController.loginPassword,
  generateAuthTokens
);
router.post('/register', authController.register, generateAuthTokens);
router.post(
  '/signup/1',
  checkSchema(signupSchema.phaseOne),
  validateRequest,
  authController.signup.phaseOne
);
router.post(
  '/signup/2',
  checkSchema(signupSchema.phaseTwo),
  validateRequest,
  authController.signup.phaseTwo
);
router.post(
  '/signup/3',
  checkSchema(signupSchema.phaseThree),
  validateRequest,
  authController.signup.phaseThree
);
router.post(
  '/signup/4',
  checkSchema(signupSchema.phaseFour),
  validateRequest,
  authController.signup.phaseFour
);
router.get(
  '/login/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);
router.get(
  '/login/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: 'http://localhost:3000',
  }),
  authController.googleLoginSuccess
);

module.exports = router;
