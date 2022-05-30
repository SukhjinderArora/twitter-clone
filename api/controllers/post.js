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
    const alreadyLiked = await prisma.like.findFirst({
      where: {
        postId: Number(postId),
        userId,
      },
    });
    if (alreadyLiked) {
      return res.status(201).json({ message: 'success' });
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

const unLikePost = async (req, res, next) => {
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
    await prisma.like.delete({
      where: {
        postId_userId: { postId: Number(postId), userId: Number(userId) },
      },
    });
    return res.status(200).json({ message: 'success' });
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

const removeRepost = async (req, res, next) => {
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
    await prisma.repost.delete({
      where: {
        postId_userId: { postId: Number(postId), userId: Number(userId) },
      },
    });
    return res.status(200).json({ message: 'success' });
  } catch (error) {
    return next(error);
  }
};

const postReply = async (req, res, next) => {
  const { postId, content } = req.body;
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
    await prisma.post.create({
      data: {
        content,
        user: {
          connect: {
            id: userId,
          },
        },
        parentPost: {
          connect: {
            id: postId,
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
  unLikePost,
  repostPost,
  removeRepost,
  postReply,
};
