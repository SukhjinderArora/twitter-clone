const createError = require('http-errors');
const prisma = require('../services/connect-db');

const createPost = async (req, res, next) => {
  const { userId } = req;
  const { content } = req.body;
  try {
    const post = await prisma.post.create({
      data: {
        content,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
    return res.status(201).json({ post });
  } catch (error) {
    return next(error);
  }
};

const likePost = async (req, res, next) => {
  const { postId } = req.body;
  const { userId } = req;
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });
    if (!post) {
      const error = createError.NotFound();
      throw error;
    }
    await prisma.like.create({
      data: {
        post: {
          connect: {
            id: Number(postId),
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
    return res.status(201).json({ message: 'success' });
  } catch (error) {
    return next(error);
  }
};

const repostPost = async (req, res, next) => {
  const { postId } = req.body;
  const { userId } = req;
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });
    if (!post) {
      const error = createError.NotFound();
      throw error;
    }
    await prisma.repost.create({
      data: {
        post: {
          connect: {
            id: Number(postId),
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
    return res.status(201).json({ message: 'success' });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createPost,
  likePost,
  repostPost,
};
