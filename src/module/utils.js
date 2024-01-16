const adminModel = require("../model/admin.M");
const nodemailer = require("nodemailer");
const util = require("util");
module.exports = {
    // 1 .. 2 3 4 current 5 6 .. total -> max_display_pages = 6
    dynamic_scroll_pagination(
        max_display_pages,
        per_page,
        current_page,
        items
    ) {
        const total_pages =
            ((items.length / per_page) >> 0) +
            (items.length % per_page == 0 ? 0 : 1);
        let start_idx = (current_page - max_display_pages / 2) >> 0;
        let end_idx = (current_page + max_display_pages / 2) >> 0;
        if (start_idx < 0 && end_idx < total_pages) end_idx += -start_idx;
        else if (end_idx > total_pages && start_idx > 0)
            start_idx -= end_idx - total_pages;
        start_idx = Math.max(start_idx, 0);
        end_idx = Math.min(end_idx, total_pages);
        return {
            pages: Array.from(
                { length: end_idx - start_idx },
                (_, i) => i + start_idx + 1
            ),
            items: items.slice(
                (current_page - 1) * per_page,
                current_page * per_page
            ),
            total_pages,
        };
    },

    divideCategories(categories) {
        const findChildCategories = (categories, id) => {
            return categories
                .filter((category) => category.parent_id === id)
                .map((category) => {
                    category.children = findChildCategories(
                        categories,
                        category.id
                    );
                    return category;
                });
        };

        level1 = categories.filter((category) => !category.parent_id);
        let dividedCategories = level1.map((item) => {
            return {
                name: item.name,
                id: item.id,
                children: findChildCategories(categories, item.id),
            };
        });
        return dividedCategories;
    },

    findCateById(categories, id) {
        return categories.filter(
            (category) =>
                category.id == id ||
                (category.children &&
                    category.children.length > 0 &&
                    category.children.some((child) =>
                        { 
                            result = this.findCateById(child.children, id)
                            if(result && result.length > 0)
                                return true
                            return false
                        }
                    ))
        );
    },
    async isAncestor(id, parent_id) {
        console.log(id, parent_id);
        let categories = await adminModel.getAll("Category");
        categories = this.divideCategories(categories);
        console.log(
            util.inspect(categories, {
                showHidden: false,
                depth: null,
                colors: true,
            })
        );
        let category = this.findCateById(categories, id);
        if (!(category && category.length > 0)) return null;
        console.log(category);
        const result = this.findCateById(category, parent_id);
        console.log(result);
        if(result && result.length > 0)
            return true
        return false;
    },

    findNameCate(cates, cateId) {
        return cates.filter((cate) => cate.id === cateId)[0]?.name;
    },

    // mode 1 - create  _ 2 - update
    async checkValidCategory(name, parent_id, category, mode = 1, id = null) {
        try {
            const categories = await adminModel.get(
                "Category",
                ` id = ${parent_id}`
            );
            if (categories && categories.length > 0) {
                categories.forEach((cate) => {
                    if (cate.name.toLowerCase() === name.toLowerCase()) {
                        return {
                            statusCode: 409,
                            msg: "The parent category and the category cannot have the same name",
                        };
                    }
                });
            }
            if (categories.length === 0 && Number(parent_id) != -1) {
                return {
                    statusCode: 409,
                    msg: "The parent category does not exist",
                };
            }
            if (category && category.length > 0) {
                return { statusCode: 409, msg: "Category existed in database" };
            }
            if (mode === 2) {
                if (await this.isAncestor(id, parent_id))
                    return {
                        statusCode: 406,
                        msg: "Child category can't be assigned to parent_id",
                    };
            }
            return { statusCode: 200, msg: "true" };
        } catch (err) {
            throw err;
        }
    },
    async sendEmail(username, password, to, subject, content) {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: username,
                pass: password,
            },
        });

        const mailOptions = {
            from: username,
            to: to,
            subject: subject,
            html: content,
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                throw error;
            } else {
                return info.response;
            }
        });
    },
};
