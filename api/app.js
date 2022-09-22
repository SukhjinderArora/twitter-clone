const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');
const usersRoutes = require('./routes/user');
const feedRoutes = require('./routes/feed');
const notificationRoutes = require('./routes/notification');
const chatRoutes = require('./routes/chat');
const searchRoutes = require('./routes/search');

const { errorLogger, errorResponder } = require('./middlewares/error-handler');
const { NODE_ENV, COOKIE_SECRET } = require('./utils/config');

const app = express();

const isDev = NODE_ENV === 'development';

app.use(morgan('dev'));
app.use(helmet());
app.use(helmet.hidePoweredBy());

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
app.use(cookieParser(COOKIE_SECRET));

app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/search', searchRoutes);

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use(errorLogger);
app.use(errorResponder);

module.exports = app;
