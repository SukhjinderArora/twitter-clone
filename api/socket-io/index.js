const { Server } = require('socket.io');
const cookieParser = require('cookie-parser');

const { NODE_ENV, COOKIE_SECRET } = require('../utils/config');
const { isAuthenticated } = require('../middlewares/auth');
const logger = require('../utils/logger');

const setupSocketServer = (server) => {
  const isDev = NODE_ENV === 'development';

  const options = isDev && {
    cors: {
      origin: 'http://localhost:3000',
      optionsSuccessStatus: 200,
      credentials: true,
    },
  };

  const io = new Server(server, options);

  const wrap = (middleware) => (socket, next) =>
    middleware(socket.request, {}, next);

  io.use(wrap(cookieParser(COOKIE_SECRET)));

  io.use(
    wrap((req, res, next) => {
      req.get = (header) => req.headers[header.toLowerCase()];
      next();
    })
  );

  io.use(wrap(isAuthenticated));

  io.on('connection', (socket) => {
    logger.info(`New connection: ${socket.id}`);
    socket.join(socket.request.userId);
    socket.on('new notification', ({ to }) => {
      io.sockets.in(to).emit('new notification', { notification: true });
    });

    socket.on('disconnect', () => {
      logger.info('user disconnected', socket.id);
    });
  });
};

module.exports = {
  setupSocketServer,
};