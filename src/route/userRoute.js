const express = require('express');
const router = express.Router();
const homepage = require('../controller/homepageController');
const pagination_util = require('../module/utils')
const database = require('../model/Product.model');
const homepageController = require('../controller/homepageController');
const adminModel = require('../model/Admin.m')
const utils = require('../module/utils')

router.get('/', async (req, res) => {
    try {
        let allProducts = await database.get_all();
        let newProducts = allProducts.slice(0, 4);
        let cates = await adminModel.getAll("Category");
        cates = utils.divideCategories(cates);
        if (!cates) next(new Error("Error occurred, Please try again"));
        else {
            cates = cates.map((cate) => {
                return {
                    ...cate,
                    parent_id: utils.findNameCate(cates, cate.parent_id),
                };
            });
        }
        const error = req.session?.messages?.pop();
        res.render("user/homepage", { is_login: req.isAuthenticated(), products: newProducts, cates, error});
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

router.use((req, res, next) => {
    // authentication guard
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/user");
    }
});

router.get('/detail', async(req, res) => {
    const productId = req.query.product_id;
    let product = await database.get(productId);
    let relatedProduct = await database.getRelatedProducts(product);
    let cates = await adminModel.getAll("Category");
    cates = utils.divideCategories(cates);
    res.render("user/product_detail", { 
        cates,
        product,
        relatedProduct,
        is_login: req.isAuthenticated(),
        error: null
    });
});

router.get('/list', homepageController.getAllProduct)
router.get('/list_type', homepageController.getByCategory)
router.get('/search', homepageController.getSearch)

module.exports = router;
