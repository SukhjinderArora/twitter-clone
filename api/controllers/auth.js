const bcrypt = require('bcrypt');
const createError = require('http-errors');
const { customAlphabet } = require('nanoid');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const ms = require('ms');

const prisma = require('../services/connect-db');
const { GOOGLE_CLIENT_ID } = require('../utils/config');
const { clearTokens, generateJWT } = require('../utils/auth');
const {
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_LIFE,
} = require('../utils/config');

const nanoid = customAlphabet('1234567890', 10);

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

const loginPassword = async (req, res, next) => {
  const { username, password } = req.body;
  let user;
  try {
    if (username.includes('@')) {
      user = await prisma.user.findUnique({
        where: {
          email: username.toLowerCase(),
        },
      });
    } else {
      user = await prisma.user.findUnique({
        where: {
          username: username.toLowerCase(),
        },
      });
    }
    if (!user || !user.hashedPassword) {
      const error = createError.Unauthorized('Invalid username or password');
      throw error;
    }
    const passwordsMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!passwordsMatch) {
      const error = createError.Unauthorized('Invalid username or password');
      throw error;
    }
    req.userId = user.id;
    return next();
  } catch (error) {
    return next(error);
  }
};

const signupPassword = {
  validateEmail: async (req, res) =>
    res.status(200).json({ message: 'validation success' }),
  createUser: async (req, res, next) => {
    const { email, name, password } = req.body;
    try {
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const username = name.toLowerCase().split(' ')[0] + nanoid();
      const user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          hashedPassword,
          username,
          provider: 'email',
          profile: {
            create: {
              name,
              img: 'https://storage.googleapis.com/twitter-clone-347513.appspot.com/images/default_avatar.jpg',
            },
          },
        },
      });
      req.userId = user.id;
      return next();
    } catch (error) {
      return next(error);
    }
  },
  updateDateOfBirth: async (req, res, next) => {
    const { userId } = req;
    const { dateOfBirth } = req.body;
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!user) {
        throw createError.NotFound();
      }
      const updatedUser = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          newUser: false,
          profile: {
            update: {
              dob: dateOfBirth,
            },
          },
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
      return res.status(201).json({ user: updatedUser });
    } catch (error) {
      return next(error);
    }
  },
  updateUsername: async (req, res, next) => {
    const { userId } = req;
    const { username } = req.body;
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!user) {
        throw createError.NotFound();
      }
      const updatedUser = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          newUser: false,
          username: username.toLowerCase(),
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
      return res.status(201).json({ user: updatedUser });
    } catch (error) {
      return next(error);
    }
  },
};

const signupGoogle = async (req, res, next) => {
  const { token } = req.body;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const existingUser = await prisma.user.findUnique({
      where: {
        email: payload.email,
      },
    });
    if (existingUser) {
      req.userId = existingUser.id;
      return next();
    }
    const { name, email, sub: googleId } = payload;
    const newUser = await prisma.user.create({
      data: {
        email,
        username: name.toLowerCase().split(' ')[0] + nanoid(),
        googleId,
        provider: 'google',
        profile: {
          create: {
            name,
            img: 'https://storage.googleapis.com/twitter-clone-347513.appspot.com/images/default_avatar.jpg',
          },
        },
      },
    });
    req.userId = newUser.id;
    return next();
  } catch (error) {
    return next(error);
  }
};

const verifyAndGenerateAccessToken = async (req, res, next) => {
  const { signedCookies } = req;
  const { refreshToken } = signedCookies;
  if (!refreshToken) {
    return res.sendStatus(204);
  }
  try {
    const refreshTokenInDB = await prisma.session.findFirst({
      where: {
        refreshToken,
      },
    });
    if (!refreshTokenInDB) {
      await clearTokens(req, res, next);
      const error = createError.Unauthorized();
      throw error;
    }
    try {
      const decodedToken = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
      const { userId } = decodedToken;
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
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
        await clearTokens(req, res);
        const error = createError('Invalid credentials', 401);
        throw error;
      }
      const accessToken = generateJWT(
        user.id,
        ACCESS_TOKEN_SECRET,
        ACCESS_TOKEN_LIFE
      );
      return res.status(200).json({
        user,
        accessToken,
        expiresAt: new Date(Date.now() + ms(ACCESS_TOKEN_LIFE)),
      });
    } catch (error) {
      return next(error);
    }
  } catch (error) {
    return next(error);
  }
};

const changePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const { userId } = req;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user || !user.hashedPassword) {
      const error = createError.Unauthorized('Invalid username or password');
      throw error;
    }
    const passwordsMatch = await bcrypt.compare(
      currentPassword,
      user.hashedPassword
    );
    if (!passwordsMatch) {
      const error = createError.Unauthorized('Invalid username or password');
      throw error;
    }
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        hashedPassword,
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
    return res.status(200).json({ user: updatedUser });
  } catch (error) {
    return next(error);
  }
};

const logout = async (req, res, next) => {
  await clearTokens(req, res, next);
  return res.sendStatus(204);
};

module.exports = {
  loginPassword,
  signupPassword,
  signupGoogle,
  verifyAndGenerateAccessToken,
  changePassword,
  logout,
};
