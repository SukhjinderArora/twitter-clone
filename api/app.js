const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

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

module.exports = app;
