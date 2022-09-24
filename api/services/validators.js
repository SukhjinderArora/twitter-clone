const prisma = require('./connect-db');

const signupSchema = {
  validateEmail: {
    name: {
      trim: true,
      notEmpty: {
        errorMessage: 'This is a mandatory field',
      },
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
      trim: true,
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
              email: value.toLowerCase(),
            },
          });
          if (user) {
            return Promise.reject(new Error('E-mail already in use'));
          }
          return true;
        },
      },
    },
  },
  validatePassword: {
    password: {
      trim: true,
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
  validateDateOfBirth: {
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
  validateUsername: {
    username: {
      trim: true,
      notEmpty: {
        errorMessage: 'This is a mandatory field',
      },
      escape: true,
      isLength: {
        options: {
          min: 3,
          max: 30,
        },
        errorMessage:
          'Username must be at least 3 characters and at most 30 characters long',
      },
      isNumeric: {
        negated: true,
        errorMessage: 'Username must be alphanumeric',
      },
      contains: {
        seed: '@',
        errorMessage: 'Invalid username. Username must not contain @',
      },
      custom: {
        options: async (value) => {
          const user = await prisma.user.findUnique({
            where: {
              username: value.toLowerCase(),
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
};

const loginSchema = {
  username: {
    trim: true,
    notEmpty: {
      errorMessage: 'This is a mandatory field',
    },
  },
  password: {
    notEmpty: {
      errorMessage: 'This is a mandatory field',
    },
  },
};

const postSchema = {
  content: {
    trim: true,
    notEmpty: {
      errorMessage: 'This is a mandatory field',
    },
    isLength: {
      options: {
        min: 1,
        max: 255,
      },
      errorMessage: 'Post length cannot be less than 1 and more than 255',
    },
  },
};

const chatSchema = {
  participantId: {
    notEmpty: {
      errorMessage: 'This is a mandatory field',
    },
    isInt: {
      errorMessage: 'Participant Id should be an integer',
    },
  },
};

const messageSchema = {
  content: {
    trim: true,
    notEmpty: {
      errorMessage: 'This is a mandatory field',
    },
    isLength: {
      options: {
        min: 1,
        max: 1000,
      },
      errorMessage: 'Message length cannot be less than 1 and more than 1000',
    },
  },
};

const passwordChangeSchema = {
  currentPassword: {
    notEmpty: {
      errorMessage: 'This is a mandatory field',
    },
  },
  newPassword: {
    trim: true,
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
  confirmPassword: {
    trim: true,
    notEmpty: {
      errorMessage: 'This is a mandatory field',
    },
    custom: {
      options: (value, { req }) => {
        if (value !== req.body.newPassword) {
          throw new Error('Confirm password does not match the password');
        }
        return true;
      },
    },
  },
};

const profileSchema = {
  name: {
    trim: true,
    notEmpty: {
      errorMessage: 'This is a mandatory field',
    },
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
  bio: {
    trim: true,
    isLength: {
      errorMessage: 'Bio cannot be more than 255 characters',
      options: {
        min: 0,
        max: 255,
      },
    },
    optional: true,
  },
  website: {
    trim: true,
    optional: { options: { checkFalsy: true } },
    isURL: {
      errorMessage: 'Invalid website URL',
      options: {
        protocols: ['http', 'https'],
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
};

const emailSchema = {
  email: signupSchema.validateEmail.email,
};

module.exports = {
  signupSchema,
  loginSchema,
  postSchema,
  chatSchema,
  messageSchema,
  passwordChangeSchema,
  profileSchema,
  emailSchema,
};
