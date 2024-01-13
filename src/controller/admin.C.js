const adminModel = require("../model/admin.M");
const accountModel = require("../model/Account.model");
const userModel = require("../model/User.model");
const bcrypt = require("bcrypt");
require("dotenv").config();
const path = require("path");
const saltRounds = process.env.SALT || 10;
const product_image_folder = process.env.PRODUCT_IMAGE_FOLDER;
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
        const { email, updatePassword, updateType } = req.body;
        if (!email || !updatePassword || !updateType)
            res.status(400).send("Missing some data");
        else {
            try {
                const account = await accountModel.get(email);
                if (!account) {
                    res.status(400).send("Not found Email in Database");
                } else {
                    const salt = bcrypt.genSaltSync(Number(saltRounds));
                    const hashed_password = bcrypt.hashSync(
                        updatePassword,
                        salt
                    );
                    await accountModel.update(
                        email,
                        hashed_password,
                        updateType
                    );
                    res.status(200).send("Update Account Successful");
                }
            } catch (err) {
                next(err);
            }
        }
    },
    // ======  Product ======
    async getAllProduct(req, res, next) {
        try {
            let raw_products = await adminModel.getAll("Products");
            let products = raw_products.map((product) => ({
                ...product,
                image: product_image_folder + product.image,
            }));
            if (!products) {
                next(new Error("Error occurred, Please try again"));
            } else {
                res.render("admin/manageProduct", { products });
            }
        } catch (err) {
            next(err);
        }
    },

    async addProduct(req, res, next) {
        const p_name = req.body.name;
        const category = req.body.category;
        const price = req.body.price;
        const stockQuantity = req.body.quantity;
        const description = req.body.desc;
        // Access file data
        const imageData = req.file;
        const fileName = imageData?.filename;
        if (
            !p_name ||
            !category ||
            !price ||
            !stockQuantity ||
            !description ||
            !fileName
        ) {
            res.status(400).send("Missing some arguments");
        } else {
            try {
                await adminModel.add("Products", {
                    p_name,
                    category,
                    price,
                    stockQuantity,
                    description,
                    image: fileName,
                });
                res.status(200).send("Add new product successful");
            } catch (err) {
                next(err);
            }
        }
    },

    async updateProduct(req, res, next) {
        const id = req.body.id;
        const p_name = req.body.name;
        const category = req.body.category;
        const price = req.body.price;
        const stockQuantity = req.body.quantity;
        const description = req.body.description;
        console.log(id, p_name, category, price, stockQuantity, description);
        if (
            !id ||
            !p_name ||
            !category ||
            !price ||
            !stockQuantity ||
            !description
        )
            res.status(400).send("Missing some arguments");
        let fileName;
        const imageData = req?.file;
        try {
            if (!imageData) {
                // skip
                await adminModel.update(
                    "Products",
                    ` id = '${id}'`,
                    ` p_name='${p_name}', category='${category}', price='${price}', 
                 "stockQuantity"='${stockQuantity}', description='${description}'`
                );
                res.status(200).send("Update Successful");
            } else {
                fileName = imageData.filename;
                await adminModel.update(
                    "Products",
                    ` id = '${id}'`,
                    ` p_name='${p_name}', category='${category}', price='${price}', 
                 "stockQuantity"='${stockQuantity}', description='${description}', image = '${fileName}'`
                );
                res.status(200).send("Update Successful");
            }
        } catch (err) {
            next(err);
        }
    },
    async deleteProduct(req, res, next) {
        const { productId } = req.body;
        console.log(productId);
        if (!productId) {
            res.status(400).send("Missing product Id");
        } else {
            try {
                await adminModel.deleteProduct(productId);
                res.status(200).send("Delete Successful");
            } catch (err) {
                next(err);
            }
        }
    },
    async getLastIdProduct() {
        try {
            return await adminModel.getLastIdProduct();
        } catch (err) {
            throw err;
        }
    },

    // ======  Category ======
    async getAllCategory(req, res, next) {
        try {
            let cates = await adminModel.getAll("Category");
            // handle cates -> display sub cate as name
            if (!cates) next(new Error("Error occurred, Please try again"));
            else {
                cates = cates.map(cate => { 
                    return ({...cate, child_cate: findNameCate(cates, cate.child_cate)})
                })
                res.status(200).render("admin/manageCategory", { cates });
            }
        } catch (err) {
            throw err;
        }
    },
};

function findNameCate(cates, cateId){ 
    return cates.filter(cate => cate.id === cateId)[0]?.name
}

function mergeSameFields(cates, cate_id){ 
    process_cates = cates.filter(cate => cate.id === cate_id)
    
}