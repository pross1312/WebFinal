const adminModel = require("../model/admin.M");
const accountModel = require("../model/Account.model");
const userModel = require("../model/User.model");
const bcrypt = require("bcrypt");
require("dotenv").config();

const saltRounds = process.env.SALT || 10;

module.exports = {
    // ======  Account ======
    async getAllAccount(req, res, next) {
        try {
            const accounts = await adminModel.getAll("Account");
            if (!accounts) next(new Error("Server can not load account table"));
            res.status(200).render("admin/manageAccount", { accounts });
        } catch (err) {
            next(err);
        }
    },

    //TODO: active toasity when error not redirect to Error page
    async addAccount(req, res, next) {
        const { email, password, type } = req.body;
        try {
            const account = await accountModel.get(email);
            console.log("account", account);
            if (account) {
                res.status(406).send("Email existed in System");
            } else {
                const salt = bcrypt.genSaltSync(Number(saltRounds));
                const hashed_password = bcrypt.hashSync(password, salt);
                await accountModel.add(
                    new accountModel.Account({
                        email,
                        password: hashed_password,
                        type,
                    })
                );
                await userModel.add(
                    new userModel.UserInfo({ email, name: "", avatar: "" })
                );
                res.status(200).send();
            }
        } catch (err) {
            next(err);
        }
    },

    async deleteAccount(req, res, next) {
        const { email_delete } = req.body;
        const email = req.user.email;
        if (!email || !email_delete) res.status(400).send("Missing email");
        else {
            if (email_delete === email)
                res.status(406).send(
                    "Not Acceptable, you are deleting current account"
                );
            else {
                try {
                    const result = await accountModel.get(email_delete);
                    if (!result) {
                        res.status(400).send("Not Found Email in Database");
                    }
                    await accountModel.delete(email_delete);
                    res.status(200).send("Delete Successfully");
                } catch (err) {
                    next(err);
                }
            }
        }
    },
    // update email, type, password
    async updateAccount(req, res, next) {
        const { email, newEmail } = req.body;
        if (!email || !newEmail) res.status(400).send("Missing email");
        else {
            try {
                const account = accountModel.get(email);
                if (!account) {
                    res.status(400).send("Not found Email in Database");
                } else {
                }
            } catch (err) {
                next(err);
            }
        }
    },
    // ======  Product ======
    async getAllProduct(req, res, next) {
        try {
            const products = await adminModel.getAll("products");
            res.render("admin/manageProduct", { products });
        } catch (err) {
            next(err);
        }
    },

    async addProduct(req, res, next) {
        const productName = req.body.name;
        const productCategory = req.body.category;
        // Access file data
        const imageData = req.file;
        console.log(productName, productCategory, imageData);
        try {
        } catch (err) {
            next(err);
        }
    },

    // ======  Order ======
    async getAllOrder(req, res, next) {},
};
