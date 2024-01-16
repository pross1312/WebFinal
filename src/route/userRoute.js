const express = require('express');
const router = express.Router();
const homepage = require('../controller/homepageController');
const pagination_util = require('../module/utils')
const database = require('../model/Product.model');
const homepageController = require('../controller/homepageController');
let last_page = 0

router.get('/', async (req, res) => {
    try {
        let array = new Array(10);
        array.fill({role: "admin", text: "hello motherf jeqwoie jioqwje oucker"});
        array = array.concat(new Array(10).fill({role: "customer", text: "hello motherf jeqwoie jioqwje oucker"}))
                    .sort(() => (Math.random() > .5) ? 1 : -1);
        let allProducts = await database.get_all();
        res.render("user/homepage", { messages: array, products: allProducts });
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
  
    res.render("user/product_detail", { 
        product,
        relatedProduct
    });
});

router.get('/list', homepageController.getAllProduct)
module.exports = router;