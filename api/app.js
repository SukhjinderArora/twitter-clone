const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const prisma = require('./utils/database');

const app = express();

const isDev = process.env.NODE_ENV === 'development';

app.use(helmet());

if (isDev) {
  const whitelist = process.env.WHITELISTED_DOMAINS
    ? process.env.WHITELISTED_DOMAINS.split(',')
    : [];
  const corsOptions = {
    origin(origin, callback) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  };
  app.use(cors(corsOptions));
}

app.use(express.json({ type: 'application/json' }));

app.get('/api/users', async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        profile: true,
      },
    });
    return res.status(200).json({
      users,
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = app;
