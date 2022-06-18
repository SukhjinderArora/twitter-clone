const prisma = require('../services/connect-db');

const createNotification = async (req, res) => {
  const { notification } = res.locals;
  await prisma.notification.create({
    data: {
      senderId: notification.senderId,
      recipientId: notification.recipientId,
      type: notification.type,
      objectType: notification.objectType,
      objectURI: notification.objectURI,
    },
  });
};

module.exports = {
  createNotification,
};
