const productModel = require('../model/MockDataProduct');

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
}

module.exports = new HomePageController();