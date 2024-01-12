const express = require('express');
const router = express.Router();
const adminController = require('../controller/admin.C')
const multer = require('multer');

const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

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



//TODO: finish when have dbo order
router.get('/list/order', (req, res) => { 
    res.render('admin/manageOrder', {orders: require('../module/mockdatabase').mockOrders})
})

module.exports = router;
