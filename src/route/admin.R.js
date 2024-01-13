const express = require('express');
const router = express.Router();
const adminController = require('../controller/admin.C')
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
            cb(console.error("Missing lastProduct"))
        }
        cb(null, lastProduct.id + 1 + path.extname(file.originalname));
    }
})

const upload = multer({storage})

router.get('/', (req, res) => {
    // Mock data 
    const orderData = [
        { date: '2023-01-01', count: 10, cash: 1000 },
        { date: '2023-01-02', count: 15, cash: 1500 },
    ];

    res.render('admin/admin', { orderData });
});

router.get('/account/list', adminController.getAllAccount)
router.post('/account/add', adminController.addAccount)
router.post('/account/delete', adminController.deleteAccount)
router.post('/account/update', adminController.updateAccount)

router.get('/product/list', adminController.getAllProduct)
router.post('/product/add', upload.single('image'), adminController.addProduct)
router.post('/product/delete', adminController.deleteProduct)
router.post('/product/update', upload.single('image'), adminController.updateProduct)

//TODO: finish when have dbo order
router.get('/list/order', (req, res) => { 
    res.render('admin/manageOrder', {orders: require('../module/mockdatabase').mockOrders})
})

module.exports = router;
