// const productModel = require('../model/MockDataProduct');
const productModel = require("../model/Product.model");
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
                res.render("user/product_list", {
                    products: items,
                    pages,
                    total_pages,
                    current_page: page,
                    base_url: "/user/list?",
                });
            }
        } catch (err) {
            next(err);
        }
    }

    async getByID(req, res, next){ 
        try {
            let product = await productModel.get(req.params.product_id);
            if (!product) {
                next(new Error("Error occurred, Please try again"));
            } else {
                res.render("user/product_detail", {
                    product
                });
            }
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new HomePageController();