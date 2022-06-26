const router = require('express').Router();

const { isAuthenticated } = require('../middlewares/auth');
const notificationController = require('../controllers/notification');

router.get(
  '/notifications',
  isAuthenticated,
  notificationController.getNotifications
);
