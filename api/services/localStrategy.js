const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const prisma = require('./connect-db');

const localLoginStrategy = new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password',
    session: false,
  },
  async (username, password, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          username,
        },
      });
      if (!user) {
        return done(null, false, { message: 'Incorrect username or password' });
      }
      const passwordsMatch = await bcrypt.compare(
        password,
        user.hashedPassword
      );
      if (passwordsMatch) {
        delete user.hashedPassword;
        return done(null, user, { message: 'Logged in Successfully' });
      }
      return done(null, false, { message: 'Incorrect username or password' });
    } catch (error) {
      return done(error);
    }
  }
);

passport.use('login', localLoginStrategy);
