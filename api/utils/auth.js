const jwt = require('jsonwebtoken');

const prisma = require('../services/connect-db');

const isDev = process.env.NODE_ENV === 'development';

const generateJWT = (userId, secret, expiresIn) =>
  jwt.sign(
    {
      userId,
    },
    secret,
    { expiresIn }
  );

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: !isDev,
  signed: true,
};

const clearTokens = async (req, res, next) => {
  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;
  if (refreshToken) {
    try {
      await prisma.session.delete({
        where: {
          refreshToken,
        },
      });
    } catch (error) {
      return next(error);
    }
  }
  return res.clearCookie('refreshToken', COOKIE_OPTIONS);
};

module.exports = { generateJWT, COOKIE_OPTIONS, clearTokens };
