import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import { User } from "../entity/User";

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
                let user = await User.findOne({
                    where: { providerId: profile.id },
                });
                if (!user) {
                    const email = profile.emails
                        ? profile.emails[0].value
                        : `${profile.id}@google.com`;

                    user = await User.create({
                        providerId: profile.id,
                        provider: "google",
                        name: profile.displayName,
                        email: email,
                        isVerified: true,
                    });
                }
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    )
);

passport.serializeUser((user, done) => done(null, (user as User).id));
passport.deserializeUser(async (id: number, done) => {
    const user = await User.findOne({ where: { id: id } });
    done(null, user);
});

export default passport;
