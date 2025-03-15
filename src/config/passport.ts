import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import argon2 from "argon2";

import User from "../models/User";
const dotenv = require("dotenv");

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ providerId: profile.id });
        if (!user) {
          const email = profile.emails ? profile.emails[0].value : `${profile.id}@google.com`;

          user = await User.create({
            providerId: profile.id,
            provider: "google",
            name: profile.displayName,
            email: email
          });
        }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

module.exports = passport;
