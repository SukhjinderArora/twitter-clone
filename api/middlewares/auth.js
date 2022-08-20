const createError = require('http-errors');
const ms = require('ms');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const prisma = require('../services/connect-db');
const { generateJWT, COOKIE_OPTIONS } = require('../utils/auth');
const {
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_LIFE,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_LIFE,
} = require('../utils/config');

const isAuthenticated = async (req, res, next) => {
  try {
    const authToken = req.get('Authorization');
    const accessToken = authToken?.split('Bearer ')[1];
    if (!accessToken) {
      const error = createError.Unauthorized();
      throw error;
    }
    const { signedCookies = {} } = req;
    const { refreshToken } = signedCookies;
    if (!refreshToken) {
      const error = createError.Unauthorized();
      throw error;
    }
    const refreshTokenInDB = await prisma.session.findFirst({
      where: {
        refreshToken,
      },
    });
    if (!refreshTokenInDB) {
      const error = createError.Unauthorized();
      throw error;
    }
    let decodedToken;
    try {
      decodedToken = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
    } catch (err) {
      const error = createError.Unauthorized();
      return next(error);
    }
    const { userId } = decodedToken;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      const error = createError.Unauthorized();
      throw error;
    }
    req.userId = user.id;
    return next();
  } catch (error) {
    return next(error);
  }
};

const generateAuthTokens = async (req, res, next) => {
  try {
    if (!req.userId) {
      const error = createError.InternalServerError();
      throw error;
    }
    const user = await prisma.user.findUnique({
      where: {
        id: req.userId,
      },
      select: {
        id: true,
        email: true,
        username: true,
        newUser: true,
        googleId: true,
        provider: true,
        createdAt: true,
        profile: true,
      },
    });
    if (!user) {
      const error = createError.Unauthorized();
      throw error;
    }
    const refreshToken = generateJWT(
      req.userId,
      REFRESH_TOKEN_SECRET,
      REFRESH_TOKEN_LIFE
    );
    const accessToken = generateJWT(
      req.userId,
      ACCESS_TOKEN_SECRET,
      ACCESS_TOKEN_LIFE
    );
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        sessions: {
          create: {
            refreshToken,
            expirationTime: new Date(Date.now() + ms(REFRESH_TOKEN_LIFE)),
          },
        },
      },
    });
    res.cookie('refreshToken', refreshToken, {
      ...COOKIE_OPTIONS,
      expires: new Date(Date.now() + ms(REFRESH_TOKEN_LIFE)),
    });
    return res.status(200).json({
      user,
      accessToken,
      expiresAt: new Date(Date.now() + ms(ACCESS_TOKEN_LIFE)),
    });
  } catch (error) {
    return next(error);
  }
};

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array({ onlyFirstError: true }),
    });
  }
  return next();
};

const isValidUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!user) {
      const error = createError.NotFound();
      throw error;
    }
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  isAuthenticated,
  generateAuthTokens,
  validateRequest,
  isValidUser,
};
