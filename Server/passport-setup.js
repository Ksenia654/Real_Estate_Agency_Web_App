const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./models/MyUser");

passport.use(
    new GoogleStrategy(
        {
            clientID: '297095761361-eflagp4vmsjd3gvbcn60jbb2h8irktih.apps.googleusercontent.com',
            clientSecret: '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',
            callbackURL: "http://localhost:5000/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            const newUser = {
                googleId: profile.id,
                username: profile.displayName,
                email: profile.emails[0].value,
                role: "user"
            };

            try {
                let user = await User.findOne({ googleId: profile.id });

                if (user) {
                    done(null, user);
                } else {
                    user = await User.create(newUser);
                    done(null, user);
                }
            } catch (err) {
                console.error(err);
                done(err, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});
