const express = require('express');
const router = express.Router();
const adminController = require('../controller/Admin.C')
const multer = require('multer');
const path = require('path')
require('dotenv').config()
const product_image_folder = process.env.PRODUCT_IMAGE_FOLDER

const storage = multer.diskStorage({ 
    destination: (req, file, cb) => { 
        if(!product_image_folder)
            cb(console.error("Missing product_image_folder"))
        cb(null, path.join(__dirname, '../' + product_image_folder))
    }, 
    filename: async (req, file, cb) => { 
        const lastProduct = await adminController.getLastIdProduct()
        if(!lastProduct){ 
            cb(null, 1 + path.extname(file.originalname));
        }
        else{ 
            cb(null, lastProduct.id + 1 + path.extname(file.originalname));
        }
    }
})

const upload = multer({storage})

const faker = require('../module/faker')
const orderData = faker.generateOrders()
router.get('/', (req, res) => {
    // Mock data 
    const cash_monthly = faker.cash_monthly(orderData, 2023);
    const year = 2023
    const order_count_monthly = faker.order_count_monthly(orderData, 2023);
    const release_year = 2019
    const current_year = new Date().getFullYear()
    res.render('admin/admin', { orderData, cash_monthly, order_count_monthly, year, release_year, current_year});
});

router.get('/statistics/', (req, res, next) => { 
    const year = parseInt(req.query.year )
    const cash_monthly = faker.cash_monthly(orderData, year);
    const order_count_monthly = faker.order_count_monthly(orderData, year);
    const release_year = 2019
    const current_year = new Date().getFullYear()
    res.render('admin/admin', { orderData, cash_monthly, order_count_monthly, year, release_year, current_year});
})


router.get('/account/list', adminController.getAllAccount)
router.post('/account/add', adminController.addAccount)
router.post('/account/delete', adminController.deleteAccount)
router.post('/account/update', adminController.updateAccount)

router.get('/product/list', adminController.getAllProduct)
router.post('/product/add', upload.single('image'), adminController.addProduct)
router.post('/product/delete', adminController.deleteProduct)
router.post('/product/update', upload.single('image'), adminController.updateProduct)

// get all category 
router.get('/category/list', adminController.getAllCategory)
router.post('/category/delete', adminController.deleteCategory)
router.post('/category/add', adminController.addCategory)
router.post('/category/update',adminController.updateCategory)
module.exports = router;
