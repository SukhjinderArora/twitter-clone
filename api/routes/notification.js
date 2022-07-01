const router = require('express').Router();

const { isAuthenticated } = require('../middlewares/auth');
const notificationController = require('../controllers/notification');

router.get('/', isAuthenticated, notificationController.getNotifications);
router.patch(
  '/read/all',
  isAuthenticated,
  notificationController.markAllNotificationsAsRead
);
router.patch(
  '/read/:id',
  isAuthenticated,
  notificationController.markNotificationAsRead
);

module.exports = router;
