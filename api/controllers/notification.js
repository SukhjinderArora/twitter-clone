const prisma = require('../services/connect-db');

const getNotifications = async (req, res, next) => {
  const { userId } = req;
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        recipientId: userId,
      },
    });
    return res.status(200).json({ notifications });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getNotifications,
};
