const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;

passport.serializeUser((profile, done) => {
    if (profile && profile.email) done(null, profile.email);
    else done("Serialize error: Invalid profile");
});

passport.deserializeUser((email, done) => {
    if (email) done(null, {email});
    else done("Deserialize error: Missing email");
});

module.exports = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new GoogleStrategy({
        callbackURL: "/auth/google/callback",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        clientID: process.env.GOOGLE_CLIENT_ID,
    }, (accessToken, refreshToken, profile, done) => {
        done(null, profile._json);
    }));
    passport.use(new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
    }, (email, password, done) => {
        done(null, {email});
    }));
};
