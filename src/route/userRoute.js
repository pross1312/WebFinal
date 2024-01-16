const express = require('express');
const router = express.Router();
const homepage = require('../controller/homepageController');
const productModel = require('../model/Product.model');
let last_page = 0

router.get('/', (req, res) => {
    let array = new Array(10);
    array.fill({role: "admin", text: "hello motherf jeqwoie jioqwje oucker"});
    array = array.concat(new Array(10).fill({role: "customer", text: "hello motherf jeqwoie jioqwje oucker"}))
                 .sort(() => (Math.random() > .5) ? 1 : -1);
    const allProducts = productModel.get_all();
    res.render("user/homepage", { messages: array, products: allProducts });
});

router.get('/detail', (req, res) => {
    const productId = req.query.product_id;
    const productDetail = productModel.getByID(productId);
  
    res.render("user/product_detail", { product: productDetail });
});

router.get('/list', (req, res) => {
    const number_of_product = productModel.getNumberOfProducT()

    // -1 cause array start at 0
    const current_page = req.query.page - 1;
    const per_page = req.query.per_page;
    let allProducts;
    
    if(current_page != 0) {
        allProducts = productModel.getPerPage(current_page + per_page + 1, per_page + last_page);
    }
    else {
        allProducts = productModel.getPerPage(current_page, per_page);
    }
    
    total_pages = Math.ceil(number_of_product/per_page)
    console.log(total_pages)
    res.render("user/product_list", { 
        products: allProducts,  
        total_pages,
        page: current_page,
        base_url: "/user/list?"
    });
});

module.exports = router;