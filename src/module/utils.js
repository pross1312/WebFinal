const adminModel = require("../model/Admin.M");
const nodemailer = require("nodemailer");
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
        },

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

    async isAncestor(categories, id, parent_id) {
        const category = await adminModel.get('Category', `id = '${id}'`);
        console.log(category);
        const containsIdInChildren = (category, parent_id) =>
            category.id === parent_id ||
            (category.children &&
                category.children.some((child) =>
                    containsIdInChildren(child, parent_id)
                ));
        const result = containsIdInChildren(category, parent_id);
        console.log(result);
        return result;
    },

    findNameCate(cates, cateId) {
        return cates.filter((cate) => cate.id === cateId)[0]?.name;
    },

    // mode 1 - create  _ 2 - update
    async checkValidCategory(name, parent_id, categories, mode = 1, id = null) {
        try {
            const category = await adminModel.get('Category', ` id = ${parent_id}`);
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
                if (await this.isAncestor(categories, id, parent_id))
                    return { statusCode: 406, msg: "Child category can't be assigned to parent_id" };
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
    }
}