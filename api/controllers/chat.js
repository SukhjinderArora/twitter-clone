const createError = require('http-errors');

const prisma = require('../services/connect-db');

const getAllChatsOfUser = async (req, res, next) => {
  const { userId } = req;
  try {
    const chats = await prisma.chat.findMany({
      where: {
        userId,
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
    });
    if (existingChat) {
      return res.status(200).json(existingChat);
    }
    const chat = await prisma.chat.create({
      data: {
        user: {
          connect: { id: userId },
        },
        participantId: Number(participantId),
      },
    });
    return res.status(201).json(chat);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllChatsOfUser,
  findOrCreateNewChat,
};
