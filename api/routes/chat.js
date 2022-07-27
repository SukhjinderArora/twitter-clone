const router = require('express').Router();
const { checkSchema } = require('express-validator');

const chatController = require('../controllers/chat');
const { isAuthenticated, validateRequest } = require('../middlewares/auth');

router.post(
  '/new',
  isAuthenticated,
  checkSchema({
    participantId: {
      notEmpty: {
        errorMessage: 'This is a mandatory field',
      },
      isInt: {
        errorMessage: 'Participant Id should be an integer',
      },
    },
  }),
  validateRequest,
  chatController.findOrCreateNewChat
);

module.exports = router;
