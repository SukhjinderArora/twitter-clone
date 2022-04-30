const prisma = require('./connect-db');

const signupSchema = {
  stepOne: {
    name: {
      notEmpty: {
        errorMessage: 'This is a mandatory field',
      },
      trim: true,
      isLength: {
        errorMessage:
          'Name must be minimum 1 character and maximum 20 characters long',
        options: {
          min: 1,
          max: 20,
        },
      },
      escape: true,
    },
    email: {
      notEmpty: {
        errorMessage: 'This is a mandatory field',
      },
      isEmail: {
        errorMessage: 'Invalid Email',
      },
      normalizeEmail: true,
      custom: {
        options: async (value) => {
          const user = await prisma.user.findUnique({
            where: {
              email: value,
            },
          });
          if (user) {
            return Promise.reject(new Error('E-mail already in use'));
          }
          return true;
        },
      },
    },
    dateOfBirth: {
      notEmpty: {
        errorMessage: 'This is a mandatory field',
      },
      isISO8601: {
        errorMessage: 'Invalid Date',
        options: {
          strict: true,
        },
      },
    },
  },
};

module.exports = {
  signupSchema,
};
