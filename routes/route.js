const express = require('express');
const router = express.Router()

router.get('/', (req, res) => {
    res.render('index')
})

router.get('/cart', (req, res) => {
    res.render('cart')
})

router.get('/checkout', (req, res) => {
    res.render('checkout')
})

router.get('/detail', (req, res) => {
    res.render('detail')
})

router.get('/shop', (req, res) => {
    res.render('shop')
})

router.get('/contact', (req, res) => {
    res.render('contact')
})

module.exports = router;