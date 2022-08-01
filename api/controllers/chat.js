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
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
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
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
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

const addNewMessageToChat = async (req, res, next) => {
  const { userId } = req;
  const { id } = req.params;
  const { content } = req.body;
  try {
    const chat = await prisma.chat.findFirst({
      where: {
        id: Number(id),
        userId,
      },
    });
    if (!chat) {
      const error = createError.NotFound();
      throw error;
    }
    const { participantId } = chat;
    let chatParticipatedIn = await prisma.chat.findFirst({
      where: {
        userId: participantId,
        participantId: userId,
      },
    });
    if (!chatParticipatedIn) {
      chatParticipatedIn = await prisma.chat.create({
        data: {
          user: {
            connect: { id: participantId },
          },
          participant: {
            connect: {
              id: userId,
            },
          },
        },
      });
    }
    const message = await prisma.message.create({
      data: {
        content,
        user: {
          connect: { id: userId },
        },
        chats: {
          connect: [{ id: chat.id }, { id: chatParticipatedIn.id }],
        },
      },
    });
    return res.status(201).json({ message });
  } catch (error) {
    return next(error);
  }
};

const markMessagesAsRead = async (req, res, next) => {
  const { userId } = req;
  const { id } = req.params;
  try {
    const chat = await prisma.chat.findFirst({
      where: {
        id: Number(id),
        userId,
      },
    });
    if (!chat) {
      const error = createError.NotFound();
      throw error;
    }
    await prisma.message.updateMany({
      where: {
        userId: chat.participantId,
      },
      data: {
        read: true,
      },
    });
    return res.status(200).json({ message: 'success' });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllChatsOfUser,
  findOrCreateNewChat,
  getChatById,
  addNewMessageToChat,
  markMessagesAsRead,
};
