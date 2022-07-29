const createError = require('http-errors');

const prisma = require('../services/connect-db');

const getAllChatsOfUser = async (req, res, next) => {
  const { userId } = req;
  try {
    const chats = await prisma.chat.findMany({
      where: {
        userId,
      },
      include: {
        participant: {
          select: {
            username: true,
            profile: {
              select: {
                name: true,
                img: true,
              },
            },
          },
        },
        messages: true,
      },
    });
    return res.status(200).json({ chats });
  } catch (error) {
    return next(error);
  }
};

const findOrCreateNewChat = async (req, res, next) => {
  const { userId } = req;
  const { participantId } = req.body;
  try {
    if (userId === Number(participantId)) {
      const error = createError.Forbidden();
      throw error;
    }
    const existingChat = await prisma.chat.findFirst({
      where: {
        userId,
        participantId: Number(participantId),
      },
      include: {
        participant: {
          select: {
            username: true,
            profile: {
              select: {
                name: true,
                img: true,
              },
            },
          },
        },
      },
    });
    if (existingChat) {
      return res.status(200).json(existingChat);
    }
    const chat = await prisma.chat.create({
      data: {
        user: {
          connect: { id: userId },
        },
        participant: {
          connect: {
            id: Number(participantId),
          },
        },
      },
    });
    return res.status(201).json(chat);
  } catch (error) {
    return next(error);
  }
};

const getChatById = async (req, res, next) => {
  const { userId } = req;
  const { id } = req.params;
  try {
    const chat = await prisma.chat.findFirst({
      where: {
        id: Number(id),
        userId,
      },
      include: {
        messages: true,
        participant: {
          select: {
            username: true,
            profile: {
              select: {
                name: true,
                img: true,
              },
            },
          },
        },
        user: {
          select: {
            username: true,
            profile: {
              select: {
                name: true,
                img: true,
              },
            },
          },
        },
      },
    });
    if (!chat) {
      const error = createError.NotFound();
      throw error;
    }
    return res.status(200).json({ chat });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllChatsOfUser,
  findOrCreateNewChat,
  getChatById,
};
