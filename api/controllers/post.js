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

module.exports = {
  createPost,
};
