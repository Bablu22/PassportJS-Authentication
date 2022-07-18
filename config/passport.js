const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const GoogleUser = require("../models/google-user");
const PORT = process.env.PORT || 3000;

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "Incorrect Username" });
      }
      if (!bcrypt.compare(password, user.password)) {
        return done(null, false, { message: "Incorrect Password" });
      }
      return done(null, user);
    } catch (error) {
      return done(err);
    }
  })
);

// Google

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `http://localhost:${PORT}/user/auth/google/callback`,
    },
    function (accessToken, refreshToken, profile, cb) {
      GoogleUser.findOne({ googleId: profile.id }, (err, user) => {
        if (err) {
          return cb(err, null);
        }

        if (!user) {
          let newUser = new GoogleUser({
            googleId: profile.id,
            username: profile.displayName,
          });
          newUser.save();
          return cb(null, newUser);
        } else {
          return cb(null, user);
        }
      });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, false);
  }
});
