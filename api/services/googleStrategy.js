const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const prisma = require('./connect-db');

const getUserProfile = (profile) => {
  const { id, displayName, emails, provider } = profile;
  if (emails && emails.length) {
    const email = emails[0].value;
    return {
      googleId: id,
      name: displayName,
      email,
      provider,
    };
  }
  return null;
};

const googleLoginStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/api/auth/login/google/callback',
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const existingGoogleUser = await prisma.user.findUnique({
        where: {
          googleId: profile.id,
        },
      });
      if (!existingGoogleUser) {
        const userProfile = getUserProfile(profile);
        const existingEmailUser = await prisma.user.findUnique({
          where: {
            email: userProfile.email,
          },
        });
        if (!existingEmailUser) {
          const newUser = await prisma.user.create({
            data: {
              email: userProfile.email,
              googleId: userProfile.googleId,
              provider: userProfile.provider,
              profile: {
                create: {
                  name: userProfile.name,
                },
              },
            },
          });
          return done(null, newUser);
        }
        return done(null, existingEmailUser);
      }
      return done(null, existingGoogleUser);
    } catch (error) {
      return done(error);
    }
  }
);

passport.use('google', googleLoginStrategy);
