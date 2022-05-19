const createError = require('http-errors');

const prisma = require('../services/connect-db');

const getUserByUsername = async (req, res, next) => {
  const { username } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        profile: true,
        followedBy: true,
        following: true,
      },
    });
    if (!user) {
      const error = createError.NotFound();
      throw error;
    }
    delete user.hashedPassword;
    delete user.newUser;
    delete user.googleId;
    delete user.provider;
    return res.status(200).json({ user });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getUserByUsername,
};
