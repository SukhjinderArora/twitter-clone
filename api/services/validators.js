const prisma = require('./connect-db');

const signupSchema = {
  phaseOne: {
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
  phaseTwo: {
    userId: {
      notEmpty: {
        errorMessage: 'This is a mandatory field',
      },
      isInt: {
        errorMessage: 'User ID must be an integer',
      },
    },
    password: {
      notEmpty: {
        errorMessage: 'This is a mandatory field',
      },
      isLength: {
        options: {
          min: 8,
          max: 16,
        },
        errorMessage:
          'Password must be at least 8 characters and at most 16 characters long',
      },
    },
  },
  phaseThree: {
    userId: {
      notEmpty: {
        errorMessage: 'This is a mandatory field',
      },
      isInt: {
        errorMessage: 'User ID must be an integer',
      },
    },
    username: {
      notEmpty: {
        errorMessage: 'This is a mandatory field',
      },
      trim: true,
      escape: true,
      isLength: {
        options: {
          min: 3,
          max: 15,
        },
        errorMessage:
          'Username must be at least 3 characters and at most 15 characters long',
      },
      isNumeric: {
        negated: true,
        errorMessage: 'Username must be alphanumeric',
      },
      custom: {
        options: async (value) => {
          const user = await prisma.user.findUnique({
            where: {
              username: value,
            },
          });
          if (user) {
            return Promise.reject(new Error('Username already in use'));
          }
          return true;
        },
      },
    },
  },
  phaseFour: {
    userId: {
      notEmpty: {
        errorMessage: 'This is a mandatory field',
      },
      isInt: {
        errorMessage: 'User ID must be an integer',
      },
    },
    bio: {
      trim: true,
      escape: true,
    },
  },
};

module.exports = {
  signupSchema,
};
