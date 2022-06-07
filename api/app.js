const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');
const usersRoutes = require('./routes/user');
const { errorLogger, errorResponder } = require('./middlewares/error-handler');

const app = express();

const isDev = process.env.NODE_ENV === 'development';

app.use(morgan('dev'));
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
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/users', usersRoutes);
app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use(errorLogger);
app.use(errorResponder);

module.exports = app;
