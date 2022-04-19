const jwt = require('jsonwebtoken');

const isDev = process.env.NODE_ENV === 'development';

const generateJWT = (userId, secret, expiresIn) =>
  jwt.sign(
    {
      userId,
    },
    secret,
    { expiresIn }
  );

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: !isDev,
  signed: true,
};

module.exports = { generateJWT, COOKIE_OPTIONS };
