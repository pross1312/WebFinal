const express = require('express');
const passport = require('passport');
const router = express.Router();
const fs = require('fs')
const adminController = require('../controller/admin.C')
router.get('/', (req, res) => {
    // Mock data 
    const orderData = [
        { date: '2023-01-01', count: 10, cash: 1000 },
        { date: '2023-01-02', count: 15, cash: 1500 },
    ];

    res.render('admin/admin', { orderData });
});

router.get('/list/account', adminController.getAllAccount)
router.post('/account', adminController.addAccount)
router.post('/account/delete', (req, res, next) => { 
    const {email} = req.body; 
    console.log(email);
})

router.get('/list/product', adminController.getAllProduct)
router.post('/product', adminController.addProduct)



//TODO: finish when have dbo order
router.get('/list/order', (req, res) => { 
    res.render('admin/manageOrder', {orders: require('../module/mockdatabase').mockOrders})
})

module.exports = router;
