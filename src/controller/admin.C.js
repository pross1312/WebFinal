const adminModel = require("../model/Admin.M");
const accountModel = require("../model/Account.model");
const productModel = require("../model/Product.model");
const userModel = require("../model/User.model");
const bcrypt = require("bcrypt");
require("dotenv").config();
const path = require("path");
var _ = require("lodash");
const {
    dynamic_scroll_pagination,
    calc_total_page,
} = require("../module/utils");
const saltRounds = process.env.SALT || 10;
const product_image_folder = process.env.PRODUCT_IMAGE_FOLDER;
const utils = require("../module/utils");
const index_out_of_range_Int = "22003";
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
                return res
                    .status(406)
                    .send("Not Acceptable, you are deleting current account");
            try {
                const result = await accountModel.get(email_delete);
                if (!result) {
                    return res.status(400).send("Not Found Email in Database");
                }
                await accountModel.delete(email_delete);
                res.status(200).send("Delete Successfully");
            } catch (err) {
                next(err);
            }
        }
    },
    // update email, type, password
    async updateAccount(req, res, next) {
        const { email, updatePassword, updateType } = req.body;
        if (!email || !updateType)
            return res.status(400).send("Missing some data");
        try {
            const account = await accountModel.get(email);
            if (!account)
                return res.status(400).send("Not found Email in Database");
            if (!updatePassword) {
                await accountModel.update(email, updateType);
            } else {
                const salt = bcrypt.genSaltSync(Number(saltRounds));
                const hashed_password = bcrypt.hashSync(updatePassword, salt);
                await accountModel.update(email, updateType, hashed_password);
            }
            return res.status(200).send("Update Account Successful");
        } catch (err) {
            next(err);
        }
    },
    // ======  Product ======
    async getAllProduct(req, res, next) {
        const page = isNaN(req.query.page) ? 1 : Number(req.query.page);
        const per_page = isNaN(req.query.per_page)
            ? 10
            : Number(req.query.per_page);
        const max_display_pages = 4;
        try {
            let products = await productModel.get_all();
            if (!products) {
                next(new Error("Error occurred, Please try again"));
            } else {
                const { pages, items, total_pages } = dynamic_scroll_pagination(
                    max_display_pages,
                    per_page,
                    page,
                    products
                );
                res.render("admin/manageProduct", {
                    products: items,
                    pages,
                    total_pages,
                    current_page: page,
                    base_url: "/admin/product/list?",
                });
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
        )
            return res.status(400).send("Missing some arguments");
        if (!(!isNaN(parseFloat(price)) && isFinite(price)))
            return res.status(500).send("Price must be Numeric");
        if (!Number.isInteger(parseInt(stockQuantity)))
            return res.status(500).send("stockQuantity must be Integer");
        try {
            const category_obj = await adminModel.getCategory(
                ` id = '${category}'`
            );
            let category_id = category_obj?.at(0)?.id;
            if (category_obj.length === 0) {
                category_id = await adminModel.addCategory({
                    name: category,
                    parent_id: -1,
                });
            }
            await adminModel.add("Products", {
                p_name,
                category: category_id,
                price,
                stockQuantity,
                description,
                image: path.join(product_image_folder, fileName),
            });
            res.status(200).send("Add new product successful");
        } catch (err) {
            next(err);
        }
    },

    async updateProduct(req, res, next) {
        const id = req.body.id;
        const p_name = req.body.name;
        const category = req.body.category;
        const price = req.body.price;
        const stockQuantity = req.body.quantity;
        let description = req.body.description;
        if (
            !id ||
            !p_name ||
            !category ||
            !price ||
            !stockQuantity ||
            !description
        )
            return res.status(400).send("Missing some arguments");
        if (!(!isNaN(parseFloat(price)) && isFinite(price)))
            return res.status(500).send("Price must be Numeric");
        if (!Number.isInteger(parseInt(stockQuantity)))
            return res.status(500).send("stockQuantity must be Integer");
        let fileName;
        const imageData = req?.file;
        if (description?.includes("'")) {
            description = description?.replace("'", "''");
        }
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
        try {
            if (!Number.isInteger(parseInt(productId))) {
                return res.status(400).send("Invalid Product id");
            }
            const result = await adminModel.deleteProduct(productId);
            if (!result) {
                error = new Error("Invalid Product id");
                error.code = index_out_of_range_Int;
            }
            return res.status(200).send("Delete Successful");
        } catch (err) {
            if (err.code === index_out_of_range_Int)
                return res.status(400).send("Invalid Product id");
            next(err);
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
            tempcates = _.cloneDeep(cates);
            cates = utils.divideCategories(cates);
            // handle cates -> display sub cate as name
            if (!cates) next(new Error("Error occurred, Please try again"));
            else {
                cates = cates.map((cate) => {
                    return {
                        ...cate,
                        parent_id: utils.findNameCate(cates, cate.parent_id),
                    };
                });
                res.status(200).render("admin/manageCategory", { cates });
            }
        } catch (err) {
            throw err;
        }
    },

    async deleteCategory(req, res, next) {
        const { id } = req.body;
        if (!id) return res.status(400).send("Missing some arguments");
        if (!Number.isInteger(parseInt(id)))
            return res.status(400).send("Invalid Category id");
        else {
            try {
                const product_in_category = await adminModel.get(
                    "Products",
                    ` category = '${id}'`
                );
                if (product_in_category && product_in_category.length > 0) {
                    return res
                        .status(406)
                        .send("Having Products in Category, Can't not delete");
                }
                const result = await adminModel.deleteCategory(id);
                if(!result)
                    return res.status(400).send("Category have children. Please delete children first")
                res.status(200).send("Delete Category Successful");
            } catch (err) {
                next(err);
            }
        }
    },
    async addCategory(req, res, next) {
        let { name, parent_id } = req.body;
        if (!name || !parent_id) res.status(400).send("Missing some arguments");
        else {
            try {
                let condition;
                if (parent_id === -1 || parent_id === "-1")
                    condition = ` name = '${name.toLowerCase()}' and parent_id IS NULL`;
                else
                    condition = ` name = '${name.toLowerCase()}' and parent_id = '${parent_id}'`;
                const categories = await adminModel.getCategory(condition);
                const checkValid = await utils.checkValidCategory(
                    name,
                    parent_id,
                    categories
                );
                if (checkValid.statusCode === 200) {
                    await adminModel.addCategory({
                        name: name.toLowerCase(),
                        parent_id,
                    });
                    return res.status(200).send("Add Category Successful");
                }
                return res.status(checkValid.statusCode).send(checkValid.msg);
            } catch (err) {
                next(err);
            }
        }
    },
    async updateCategory(req, res, next) {
        const { id, name, parent_id } = req.body;
        if (!id || !name || !parent_id)
            return res.status(400).send("Missing some arguments");

        try {
            let condition;
            if (parent_id === -1 || parent_id === "-1") {
                condition = ` name = '${name.toLowerCase()}' and parent_id IS NULL`;
            } else
                condition = ` name = '${name.toLowerCase()}' and parent_id = '${parent_id}'`;
            const categories = await adminModel.getCategory(condition);
            const checkValidUpdate = await utils.checkValidCategory(
                name,
                parent_id,
                categories,
                2,
                id
            );

            if (checkValidUpdate?.statusCode === 200) {
                await adminModel.updateCategory({ id, name, parent_id });
                return res.status(200).send("Update Category Successful");
            }
            return res
                .status(checkValidUpdate?.statusCode)
                .send(checkValidUpdate?.msg);
        } catch (err) {
            next(err);
        }
    },
};
