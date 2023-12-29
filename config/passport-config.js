const passport = require("passport");
const bcrypt = require("bcrypt");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const AccountModel = require("../model/Account.model");
const UserModel = require("../model/User.model");

passport.serializeUser((profile, done) => {
    if (profile && profile.email) done(null, profile.email);
    else done("Serialize error: Invalid profile");
});

passport.deserializeUser(async (email, done) => {
    try {
        if (email) done(null, await UserModel.get(email));
        else done("Deserialize error: Missing email");
    } catch(err) {
        done(err);
    }
});

module.exports = async (app) => {
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new GoogleStrategy({
        callbackURL: "/auth/google/callback",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        clientID: process.env.GOOGLE_CLIENT_ID,
    }, async (accessToken, refreshToken, profile, done) => {
        profile = profile._json;
        try {
            let acc = await AccountModel.get(profile.email);
            let user_profile = null;
            if (!acc) {
                acc = new AccountModel.Account({email: profile.email, password: null});
                await AccountModel.add(acc);
                user_profile = new UserModel.UserInfo({
                    name: profile.name,
                    avatar: profile.picture,
                    email: profile.email
                });
                await UserModel.add(user_profile);
            } else await UserModel.get(profile.email);
            done(null, user_profile);
        } catch(err) {
            done(err, null);
        }
    }));
    passport.use(new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
    }, async (email, password, done) => {
        try {
            const acc = await AccountModel.get(null, email);
            if (acc && bcrypt.compareSync(password, acc.password)) {
                done(null, await UserModel.get(email));
            } else {
                done(null, false, {message: "Invalid email or password"});
            }
        } catch(err) {
            done(err, null);
        }
    }));
};
