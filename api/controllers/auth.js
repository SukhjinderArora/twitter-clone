const passport = require('passport');
const ms = require('ms');
const bcrypt = require('bcrypt');
const createError = require('http-errors');
const { customAlphabet } = require('nanoid');

const prisma = require('../services/connect-db');
const { generateJWT, COOKIE_OPTIONS } = require('../utils/auth');

const nanoid = customAlphabet('1234567890', 10);

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
  validateEmail: async (req, res) =>
    res.status(200).json({ message: 'validation success' }),
  createUser: async (req, res, next) => {
    const { email, name, dateOfBirth, password } = req.body;
    try {
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const username = name.split(' ')[0] + nanoid();
      const user = await prisma.user.create({
        data: {
          email,
          hashedPassword,
          username,
          profile: {
            create: {
              name,
              dob: dateOfBirth,
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
          username,
        },
      });
      delete updatedUser.hashedPassword;
      return res.status(201).json({ user: updatedUser });
    } catch (error) {
      return next(error);
    }
  },
  // phaseFour: async (req, res, next) => {
  //   const { userId, bio } = req.body;
  //   try {
  //     const user = await prisma.user.findUnique({
  //       where: {
  //         id: userId,
  //       },
  //     });
  //     if (!user) {
  //       throw createError.NotFound();
  //     }
  //     const updatedUser = await prisma.user.update({
  //       where: {
  //         id: user.id,
  //       },
  //       data: {
  //         profile: {
  //           update: {
  //             bio,
  //           },
  //         },
  //       },
  //     });
  //     delete updatedUser.hashedPassword;
  //     return res.status(201).json({ user: updatedUser });
  //   } catch (error) {
  //     return next(error);
  //   }
  // },
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
