const express = require('express');
const passport = require('passport');

const authController = require('../controllers/auth');
const { generateAuthTokens } = require('../middlewares/auth');

const router = express.Router();

router.post(
  '/login/password',
  authController.loginPassword,
  generateAuthTokens
);
router.post('/register', authController.register, generateAuthTokens);
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