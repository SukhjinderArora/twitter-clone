const bcrypt = require('bcrypt');
const createError = require('http-errors');
const { customAlphabet } = require('nanoid');

const prisma = require('../services/connect-db');

const nanoid = customAlphabet('1234567890', 10);

const login = async (req, res, next) => {
  const { username, password } = req.body;
  let user;
  try {
    if (username.includes('@')) {
      user = await prisma.user.findUnique({
        where: {
          email: username,
        },
      });
    } else {
      user = await prisma.user.findUnique({
        where: {
          username,
        },
      });
    }
    if (!user) {
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

module.exports = { login, signup };
