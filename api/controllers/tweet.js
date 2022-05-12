const prisma = require('../services/connect-db');

const createTweet = async (req, res, next) => {
  const { userId } = req;
  const { content } = req.body;
  try {
    const tweet = await prisma.tweet.create({
      data: {
        content,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
    return res.status(201).json({ tweet });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createTweet,
};
