const { Router } = require('express');
const router = Router();

// Controllers
const mainController = require('../controller/controllers')
const newsletterController = require('../controller/controllers')
const contactController = require('../controller/controllers')

// Middlewares
const ensureAuthenticated = require('../middleware/auth')
const checkFormSubmission = require('../middleware/formAuth')

// Routes
router.post('/signup', mainController.signUp);
router.post('/login', mainController.logIn);
router.get('/logout', mainController.logOut);
router.post('/newsletter', newsletterController.createNewsletter);
router.get('/api/v1/newsletter', newsletterController.getNewsletter);
router.post('/contact_form', contactController.createContact)
router.get('/api/v1/contact_form', contactController.getContact)

// The Handlebars Hbs Routes
router.get('/', (req, res) => {
    res.render('login')
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.get('/home', ensureAuthenticated, (req, res) => {
    res.render('home');
});

router.get('/cart', ensureAuthenticated, (req, res) => {
    res.render('cart');
});

router.get('/checkout', ensureAuthenticated, (req, res) => {
    res.render('checkout');
});

router.get('/detail', ensureAuthenticated, (req, res) => {
    res.render('detail');
})

router.get('/shop', ensureAuthenticated, (req, res) => {
    res.render('shop');
})

router.get('/contact', ensureAuthenticated, (req, res) => {
    res.render('contact');
})

router.get('/contact-success', checkFormSubmission, (req, res) => {
  res.render('contact-success');
})

router.get('/forbidden', (req, res) => {
  res.render('403')
})

module.exports = router