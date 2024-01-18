const AccountModel = require("../model/Account.model");
const UserModel = require("../model/User.model");
const bcrypt = require("bcrypt");
const fs = require("fs/promises");
const payment_req = require("../module/payment_req");
const { sendEmail } = require("../module/utils");
const path = require("path");
const { TimeoutMap } = require("../module/TimeoutMap");
const ChatModel = require("../model/Chat.model");
require("dotenv").config;
const saltRounds = Number(process.env.SALT)
const unconfirmed_account = new TimeoutMap();
module.exports = {
    async verify(req, res, next) {
        const {code} = req.body;
        if (!code) {
            res.render('verify', {error: "Missing verification code"});
        } else try {
            const auth = unconfirmed_account.pop(code);
            if (auth == null) {
                res.render('verify', {error: "Incorrect code"});
            } else {
                // register payment account
                const response = await payment_req.post("/register", JSON.stringify({
                    email: auth.email,
                    password: auth.password,
                }));
                if (response.code === 200) {
                    // salt 10
                    const hashedPassword = await bcrypt.hash(
                        auth.password,
                        saltRounds || 10
                    );
                    acc = new AccountModel.Account({
                        email: auth.email,
                        password: hashedPassword,
                        type: "customer"
                    });
                    await AccountModel.add(acc);
                    await UserModel.add(new UserModel.UserInfo({email: auth.email}));
                    await ChatModel.add(new ChatModel.ChatMessage({
                        role: "admin",
                        content: "Hi, how can i help you?",
                        email: auth.email
                    }));
                    res.redirect("/user");
                } else {
                    res.render("register", {error: response.data});
                }
            }
        } catch(err) {
            next(err);
        }
    },
    async register(req, res, next) {
        // update with jquery
        const {email, password} = req.body;
        const password_regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!email || !password) {
            res.render('register', {error: "Can't load your data"});
            return;
        }
        try {
            if (!password_regex.test(password)) {
                res.render('register', {error: "Password must have minimum 8 characters, at least 1 letter and 1 number"});
                return;
            }
            let acc = await AccountModel.get(email);
            if (acc) {
                res.render('register', {error: "Email existed"});
                return;
            }
            let code = ((Math.random() * 10000000) >> 0) + 1000000;
            while (unconfirmed_account.get(code) !== null) {
                code = ((Math.random() * 10000000) >> 0) + 1000000;
            }
            req.app.render( "verify_email", {
                recipientName: email,
                verificationCode: code
            }, async (err, html) => {
                if (err) throw new Error(err);
                try {
                    await sendEmail(
                        process.env.EMAIL_USERNAME,
                        process.env.EMAIL_PASSWORD, email, "Verfiy password",
                        html,
                    );
                    unconfirmed_account.put(code, {email, password}, 10*60*1000);
                    res.render("verify", {error: null});
                } catch(err) {
                    res.render("register", {error: "Invalid email"});
                }
            });
        } catch (err) {
            next(err);
        }
    },
};
