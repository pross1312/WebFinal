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
        try {
            const { email, password, type } = req.body;
            const salt = bcrypt.genSaltSync(Number(saltRounds));
            const hashed_password = bcrypt.hashSync(
                password,
                salt
            );
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
            const accounts = await adminModel.getAll("Account");
            res.status(200).render("admin/manageAccount", { accounts });
        } catch (err) {
            next(err);
        }
    },

    async deleteAccount(req,res,next){ 
        try{ 
            const {email} = req.body
            if(!email)
                res.status(400).send("Missing email")
            
        }
        catch(err)
        { 
            next(err)
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
        try {
        } catch (err) {
            next(err);
        }
    },

    // ======  Order ======
    async getAllOrder(req, res, next) {},
};
