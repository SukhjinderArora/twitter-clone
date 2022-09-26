const jwt = require('jsonwebtoken');

const prisma = require('../services/connect-db');
const { NODE_ENV } = require('./config');

const isDev = NODE_ENV === 'development';

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
      const token = await prisma.session.findUnique({
        where: {
          refreshToken,
        },
      });
      if (token) {
        await prisma.session.delete({
          where: {
            refreshToken: token,
          },
        });
      }
    } catch (error) {
      return next(error);
    }
  }
  return res.clearCookie('refreshToken', COOKIE_OPTIONS);
};

module.exports = { generateJWT, COOKIE_OPTIONS, clearTokens };
