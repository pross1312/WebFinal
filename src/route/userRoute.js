const express = require('express');
const router = express.Router();
const homepage = require('../controller/homepageController');
const database = require('../model/Product.model');
const homepageController = require('../controller/homepageController');
const adminModel = require('../model/Admin.m')
const utils = require('../module/utils')

router.get('/', async (req, res) => {
    try {
        let array = new Array(10);
        array.fill({role: "admin", text: "hello motherf jeqwoie jioqwje oucker"});
        array = array.concat(new Array(10).fill({role: "customer", text: "hello motherf jeqwoie jioqwje oucker"}))
                    .sort(() => (Math.random() > .5) ? 1 : -1);

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
        console.log(cates);
        res.render("user/homepage", { messages: array, products: newProducts, cates});
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/detail', async(req, res) => {
    const productId = req.query.product_id;
    let product = await database.get(productId);
    let relatedProduct = await database.getRelatedProducts(product);

    let cates = await adminModel.getAll("Category");
    cates = utils.divideCategories(cates);
    if (!cates) next(new Error("Error occurred, Please try again"));
  
    res.render("user/product_detail", { 
        product,
        relatedProduct,
        cates
    });
});

router.get('/list', homepageController.getAllProduct)
router.get('/list_type', homepageController.getByCategory)
router.get('/search', homepageController.getSearch)
router.get('/transaction', homepageController.getTransaction)

module.exports = router;