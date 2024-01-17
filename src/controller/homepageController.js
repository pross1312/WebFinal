// const productModel = require('../model/MockDataProduct');
const productModel = require("../model/Product.model");
const adminModel = require("../model/Admin.m");
const utils = require("../module/utils");
const {
    dynamic_scroll_pagination,
    calc_total_page,
} = require("../module/utils");

class HomePageController {
    async ShowHomePage(req, res) {
        try {
            const allProducts = await productModel.getAllProducts();
            res.render('user/homepage', { 
                products: allProducts,
                is_login: req.isAuthenticated(),
            });

        } catch (error) {
          console.error("error: ", error);
        }
    }

    async getAllProduct(req, res, next) {
        const page = isNaN(req.query.page) ? 1 : Number(req.query.page);
        const per_page = isNaN(req.query.per_page)
            ? 12
            : Number(req.query.per_page);
        const max_display_pages = 4;

        let cates = await adminModel.getAll("Category");
        cates = utils.divideCategories(cates);
        if (!cates) next(new Error("Error occurred, Please try again"));

        try {
            let products = await productModel.get_all();
            let cates = await adminModel.getAll("Category");
            cates = utils.divideCategories(cates);
            if (!products || !cates) {
                next(new Error("Error occurred, Please try again"));
            } else {
                const { pages, items, total_pages } = dynamic_scroll_pagination(
                    max_display_pages,
                    per_page,
                    page,
                    products
                );
                res.render("user/product_list", {
                    cates,
                    products: items,
                    pages,
                    total_pages,
                    current_page: page,
                    base_url: "/user/list?",
                    is_login: req.isAuthenticated(),
                });
            }
        } catch (err) {
            next(err);
        }
    }

    async getByID(req, res, next){ 
        try {
            let product = await productModel.get(req.params.product_id);

            let cates = await adminModel.getAll("Category");
            cates = utils.divideCategories(cates);
            if (!cates) next(new Error("Error occurred, Please try again"));

            if (!product) {
                next(new Error("Error occurred, Please try again"));
            } else {
                res.render("user/product_detail", {
                    product,
                    is_login: req.isAuthenticated(),
                });
            }
        } catch (err) {
            next(err);
        }
    }

    async getByCategory(req, res, next){ 
        const page = isNaN(req.query.page) ? 1 : Number(req.query.page);
        const per_page = isNaN(req.query.per_page)
            ? 12
            : Number(req.query.per_page);
        const max_display_pages = 4;
        try {
            let type = req.query.type;
            let products = await productModel.getByCategory(type);
            let cates = await adminModel.getAll("Category");
            cates = utils.divideCategories(cates);
            if (!products || !cates) {
                next(new Error("Error occurred, Please try again"));
            } else {
                const { pages, items, total_pages } = dynamic_scroll_pagination(
                    max_display_pages,
                    per_page,
                    page,
                    products,
                );
                res.render("user/product_list", {
                    cates,
                    products: items,
                    pages,
                    total_pages,
                    current_page: page,
                    base_url: "/user/list?",
                    is_login: req.isAuthenticated(),
                });
            }
        } catch (err) {
            next(err);
        }
    }

    async getSearch(req, res, next) {
        const page = isNaN(req.query.page) ? 1 : Number(req.query.page);
        const per_page = isNaN(req.query.per_page)
            ? 12
            : Number(req.query.per_page);
        const max_display_pages = 6;
        try {
            let pattern = req.query.pattern
            let products = await productModel.getByPattern(pattern);
            let cates = await adminModel.getAll("Category");
            cates = utils.divideCategories(cates);
            if (!products || !cates) {
                next(new Error("Error occurred, Please try again"));
            } else {
                const { pages, items, total_pages } = dynamic_scroll_pagination(
                    max_display_pages,
                    per_page,
                    page,
                    products
                );
                res.render("user/product_list", {
                    cates,
                    products: items,
                    pages,
                    total_pages,
                    current_page: page,
                    base_url: `/user/search?pattern=${pattern}&`,
                    is_login: req.isAuthenticated()
                });
            }
        } catch (err) {
            next(err);
        }
    }

}

module.exports = new HomePageController();
