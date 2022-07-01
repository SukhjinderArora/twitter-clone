const createError = require('http-errors');

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
    const unReadNotificationCount = await prisma.notification.count({
      where: {
        recipientId: userId,
        read: false,
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
      include: {
        recipient: {
          select: {
            id: true,
            username: true,
            profile: {
              select: {
                name: true,
              },
            },
          },
        },
        sender: {
          select: {
            id: true,
            username: true,
            profile: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    return res.status(200).json({
      info: {
        total,
        unReadNotifications: unReadNotificationCount,
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

const markNotificationAsRead = async (req, res, next) => {
  const { id } = req.params;
  const { userId } = req;
  try {
    const notification = await prisma.notification.findFirst({
      where: {
        id: Number(id),
        recipientId: userId,
      },
    });
    if (!notification) {
      const error = createError.NotFound();
      throw error;
    }
    const updatedNotification = await prisma.notification.update({
      where: {
        id: Number(id),
      },
      data: {
        read: true,
      },
    });
    return res.status(200).json({ notification: updatedNotification });
  } catch (error) {
    return next(error);
  }
};

const markAllNotificationsAsRead = async (req, res, next) => {
  const { userId } = req;
  try {
    const notifications = await prisma.notification.updateMany({
      where: {
        recipientId: userId,
        createdAt: {
          lte: new Date(),
        },
      },
      data: {
        read: true,
      },
    });
    return res.status(200).json({ notifications });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};
