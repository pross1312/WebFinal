const adminModel = require("../model/admin.M");
const accountModel = require("../model/Account.model");
const userModel = require("../model/User.model");
const bcrypt = require("bcrypt");
require("dotenv").config();
const path = require("path");
var _ = require("lodash");
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
        if (!email || !updatePassword || !updateType)
            return res.status(400).send("Missing some data");
        try {
            const account = await accountModel.get(email);
            if (!account)
                return res.status(400).send("Not found Email in Database");
            const salt = bcrypt.genSaltSync(Number(saltRounds));
            const hashed_password = bcrypt.hashSync(updatePassword, salt);
            await accountModel.update(email, hashed_password, updateType);
            res.status(200).send("Update Account Successful");
        } catch (err) {
            next(err);
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
        )
            return res.status(400).send("Missing some arguments");
        if (!(!isNaN(parseFloat(price)) && isFinite(price)))
            return res.status(500).send("Price must be Numeric");
        if (isNaN(parseInt(stockQuantity)))
            return res.status(500).send("stockQuantity must be Integer");
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
    },

    async updateProduct(req, res, next) {
        const id = req.body.id;
        const p_name = req.body.name;
        const category = req.body.category;
        const price = req.body.price;
        const stockQuantity = req.body.quantity;
        const description = req.body.description;
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
        if (isNaN(parseInt(stockQuantity)))
            return res.status(500).send("stockQuantity must be Integer");
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
        if (!productId) return res.status(400).send("Missing product Id");
        try {
            await adminModel.deleteProduct(productId);
            res.status(200).send("Delete Successful");
        } catch (err) {
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
            cates = divideCategories(cates);
            // handle cates -> display sub cate as name
            if (!cates) next(new Error("Error occurred, Please try again"));
            else {
                cates = cates.map((cate) => {
                    return {
                        ...cate,
                        parent_id: findNameCate(cates, cate.parent_id),
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
        if (!id) res.status(400).send("Missing some arguments");
        else {
            try {
                await adminModel.deleteCategory(id);
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
                const checkValid = await checkValidCategory(
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
            const checkValidUpdate = await checkValidCategory(
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

function findNameCate(cates, cateId) {
    return cates.filter((cate) => cate.id === cateId)[0]?.name;
}

// mode 1 - create
// mode 2 - update
async function checkValidCategory(
    name,
    parent_id,
    categories,
    mode = 1,
    id = null
) {
    try {
        const category = await adminModel.getCategory(` id = ${parent_id}`);
        if (category && category.length > 0) {
            category.forEach((cate) => {
                if (cate.name.toLowerCase() === name.toLowerCase()) {
                    return {
                        statusCode: 409,
                        msg: "The parent category and the category cannot have the same name",
                    };
                }
            });
        }
        if (category.length === 0 && Number(parent_id) != -1) {
            return {
                statusCode: 409,
                msg: "The parent category does not exist",
            };
        }
        if (categories && categories.length > 0) {
            return { statusCode: 409, msg: "Category existed in database" };
        }
        if (mode === 2) {
            if(isAncestor)
                return {statusCode: 406, msg: "You create infinity loop"}
        }
        return { statusCode: 200, msg: "true" };
    } catch (err) {
        throw err;
    }
}

function divideCategories(categories) {
    level1 = categories.filter((category) => !category.parent_id);
    let dividedCategories = level1.map((item) => {
        return {
            name: item.name,
            id: item.id,
            children: findChildCategories(categories, item.id),
        };
    });
    return dividedCategories;
}

// -> :parent of
// Electronic -> Laptop -> Lenovo
// function check if Lenovo -> Electronic return false
function isAncestor(categories, id, parent_id) {
    const findCateById = (arr, id) =>
        arr.find((obj) => obj.id === id) ||
        arr.reduce(
            (result, obj) =>
                result || (obj.children && findCateById(obj.children, id)),
            null
        );
    const category = findObjectById(categories, id);

    const containsIdInChildren = (category, parent_id) =>
        category.id === parent_id ||
        (category.children &&
            category.children.some((child) =>
                containsIdInChildren(child, parent_id)
            ));
    const result = containsIdInChildren(category, parent_id)
    return result
}

function findChildCategories(categories, id) {
    return categories
        .filter((category) => category.parent_id === id)
        .map((category) => {
            category.children = findChildCategories(categories, category.id);
            return category;
        });
}
