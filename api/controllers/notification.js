const prisma = require('../services/connect-db');

const getNotifications = async (req, res, next) => {
  const { userId } = req;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  try {
    const total = await prisma.notification.count({
      where: {
        recipientId: userId,
      },
    });
    const notifications = await prisma.notification.findMany({
      where: {
        recipientId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    return res.status(200).json({
      info: {
        total,
        nextPage:
          total > (page - 1) * limit + notifications.length ? page + 1 : null,
        prevPage: page === 1 ? null : page - 1,
      },
      results: notifications,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getNotifications,
};
