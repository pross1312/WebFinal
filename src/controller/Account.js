const AccountModel = require("../model/Account.model");
const UserModel = require("../model/User.model");
const bcrypt = require("bcrypt");
const payment_req = require("../module/payment_req");
require("dotenv").config;
const saltRounds = Number(process.env.SALT)
module.exports = {
    async register(req, res, next) {
        // update with jquery
        email = req.body.email;
        password = req.body.password;
        if (!email || !password) {
            res.render('register', {error: "Can't load your data"});
        }
        try {
            let acc = await AccountModel.get(email);
            if (acc) {
                res.render('register', {error: "Email existed"});
                return;
            }
            // salt 10
            const hashedPassword = await bcrypt.hash(
                password,
                saltRounds || 10
            );

            acc = new AccountModel.Account({
                email: email,
                password: hashedPassword,
                type: "customer"
            });
            const result = await AccountModel.add(acc);
            user_profile = new UserModel.UserInfo({
                name: "",
                avatar: "",
                email: email,
            });
            await UserModel.add(user_profile);
            const response = await payment_req.post("/register", JSON.stringify({
                email,
                password
            }));
            res.render('login', {error: ""})
        } catch (err) {
            next(err);
        }
    },
};
