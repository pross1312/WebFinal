const express = require('express');
const passport = require('passport');
const router = express.Router();
const fs = require('fs')

router.get('/', (req, res) => {
    // Mock data 
    const orderData = [
        { date: '2023-01-01', count: 10, cash: 1000 },
        { date: '2023-01-02', count: 15, cash: 1500 },
    ];

    res.render('admin', { orderData });
});

router.get('/manage/account', (req, res) => { 
    const users = [
        { id: 1, email: 'user1@example.com', password: 'password1' },
        { id: 2, email: 'user2@example.com', password: 'password2' },
    ];
    res.render('manageAccount', {users})
})

router.get('/manage/product', (req, res) => { 
    res.render('manageProduct', {products: require('../module/mockdatabase').products})
})

router.get('/manage/order', (req, res) => { 
    res.render('manageOrder', {orders: require('../module/mockdatabase').mockOrders})
})
module.exports = router;
