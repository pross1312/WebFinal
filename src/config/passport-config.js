const passport = require('passport');
const bcrypt = require('bcrypt');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const AccountModel = require('../model/Account.model');
const UserModel = require('../model/User.model');
const ChatModel = require('../model/Chat.model');
require('dotenv').config

passport.serializeUser((profile, done) => {
    if (profile && profile.email) done(null, profile.email);
    else done('Serialize error: Invalid profile');
});

passport.deserializeUser(async (email, done) => {
    try {
        if (email) done(null, await AccountModel.get(email));
        else done('Deserialize error: Missing email');
    } catch (err) {
        done(err);
    }
});

module.exports = async (app) => {
    app.use(passport.initialize());
    app.use(passport.session());
   
    passport.use(
        new GoogleStrategy(
            {
                callbackURL: '/auth/google/callback',
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                clientID: process.env.GOOGLE_CLIENT_ID,
                passReqToCallback: true,
            },
            async (req, accessToken, refreshToken, profile, done) => {
                profile = profile._json;
                try {
                    let acc = await AccountModel.get(profile.email);
                    let user_profile = null;
                    if (!acc) {
                        acc = new AccountModel.Account({
                            email: profile.email,
                            password: null,
                            type: "customer"
                        });
                        await AccountModel.add(acc);
                        user_profile = new UserModel.UserInfo({
                            name: profile.name,
                            avatar: profile.picture,
                            email: profile.email,
                        });
                        await UserModel.add(user_profile);
                        await ChatModel.add(new ChatModel.ChatMessage({
                            role: "admin",
                            content: "Hi, how can i help you?",
                            email: profile.email,
                        }));
                        done(null, acc);
                    } else if (acc.password !== null) {
                        // TODO: find a better way ?
                        req._response.render("login", {error: "Email had been registered, please login using password"});
                    } else done(null, acc);
                } catch (err) {
                    done(err, null);
                }
            },
        ),
    );
    passport.use(
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password',
            },
            async (email, password, done) => {
                try {
                    const acc = await AccountModel.get(email);
                    if (acc && bcrypt.compareSync(password, acc.password)) {
                        done(null, acc);
                    } else {
                        done(null, false, {
                            message: 'Invalid email or password',
                        });
                    }
                } catch (err) {
                    done(err, null);
                }
            },
        ),
    );

    app.get('/logout', function(req, res, next) {
        req.logout(function(err) {
            if (err) { return next(err); }
            res.redirect('/');
        });
    });
};
