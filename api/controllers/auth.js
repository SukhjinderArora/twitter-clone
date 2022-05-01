const passport = require('passport');
const ms = require('ms');
const bcrypt = require('bcrypt');
const createError = require('http-errors');

const prisma = require('../services/connect-db');
const { generateJWT, COOKIE_OPTIONS } = require('../utils/auth');

const loginPassword = async (req, res, next) => {
  passport.authenticate(
    'login',
    { session: false },
    async (error, user, info) => {
      try {
        if (error) {
          return res.status(400).json({ error });
        }
        if (!user) {
          return res.status(400).json({ message: info.message });
        }
        req.userId = user.id;
        return next();
      } catch (err) {
        return next(err);
      }
    }
  )(req, res, next);
};

const register = async (req, res, next) => {
  const { name, email, username, password } = req.body;
  const saltRounds = 12;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await prisma.user.create({
      data: {
        email,
        username,
        hashedPassword,
        provider: 'email',
        profile: {
          create: {
            name,
          },
        },
      },
    });
    req.userId = user.id;
    return next();
  } catch (error) {
    return next(error);
  }
};

const signup = {
  phaseOne: async (req, res, next) => {
    const { email, name, dateOfBirth } = req.body;
    try {
      const user = await prisma.user.create({
        data: {
          email,
          profile: {
            create: {
              name,
              dob: dateOfBirth,
            },
          },
        },
      });
      return res.status(201).json({ user });
    } catch (error) {
      return next(error);
    }
  },
  phaseTwo: async (req, res, next) => {
    const { userId, password } = req.body;
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!user) {
        throw createError.NotFound();
      }
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const updatedUser = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          hashedPassword,
        },
      });
      delete updatedUser.hashedPassword;
      return res.status(201).json({ user: updatedUser });
    } catch (error) {
      return next(error);
    }
  },
  phaseThree: async (req, res, next) => {
    const { userId, username } = req.body;
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
          username,
        },
      });
      delete updatedUser.hashedPassword;
      return res.status(201).json({ user: updatedUser });
    } catch (error) {
      return next(error);
    }
  },
  phaseFour: async (req, res, next) => {
    const { userId, bio } = req.body;
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
          profile: {
            update: {
              bio,
            },
          },
        },
      });
      delete updatedUser.hashedPassword;
      return res.status(201).json({ user: updatedUser });
    } catch (error) {
      return next(error);
    }
  },
};

const googleLoginSuccess = async (req, res) => {
  const refreshToken = generateJWT(
    req.user.id,
    process.env.REFRESH_TOKEN_SECRET,
    process.env.REFRESH_TOKEN_LIFE
  );
  const accessToken = generateJWT(
    req.user.id,
    process.env.ACCESS_TOKEN_SECRET,
    process.env.ACCESS_TOKEN_LIFE
  );
  await prisma.user.update({
    where: {
      id: req.user.id,
    },
    data: {
      sessions: {
        create: {
          refreshToken,
          expirationTime: new Date(
            Date.now() + ms(process.env.REFRESH_TOKEN_LIFE)
          ),
        },
      },
    },
  });
  res.cookie('refreshToken', refreshToken, {
    ...COOKIE_OPTIONS,
    expires: new Date(Date.now() + ms(process.env.REFRESH_TOKEN_LIFE)),
  });
  res.cookie('accessToken', accessToken, {
    ...COOKIE_OPTIONS,
    httpOnly: false,
    expires: new Date(Date.now() + ms(process.env.ACCESS_TOKEN_LIFE)),
  });
  res.redirect('http://localhost:3000/signin/oauth?provider=google');
};

module.exports = { loginPassword, register, signup, googleLoginSuccess };
