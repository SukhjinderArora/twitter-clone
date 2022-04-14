const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const prisma = require('./utils/database');

const app = express();

const isDev = process.env.NODE_ENV === 'development';

app.use(helmet());

if (isDev) {
  app.use(
    cors({
      origin: 'http://localhost:3000',
      optionsSuccessStatus: 200,
      credentials: true,
    })
  );
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
