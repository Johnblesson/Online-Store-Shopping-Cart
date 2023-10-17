const { Router } = require('express');
const router = Router();

// Controllers
const mainController = require('../controller/controllers')
const newsletterController = require('../controller/controllers')
const contactController = require('../controller/controllers')

// Middlewares
const ensureAuthenticated = require('../middleware/auth')
const checkFormSubmission = require('../middleware/formAuth')
const isAdmin = require('../middleware/adminAuth')
const isAuthenticated = require('../middleware/isAuth')

// Routes
router.post('/signup', mainController.signUp);
router.post('/login', mainController.logIn);
router.get('/logout', mainController.logOut);
router.post('/newsletter', newsletterController.createNewsletter);
router.post('/contact_form', contactController.createContact);
router.get('/api/v1/newsletter', isAuthenticated, isAdmin, newsletterController.getNewsletter);
router.get('/api/v1/contact_form', isAuthenticated, isAdmin, contactController.getContact);
router.post('/admin_signup', mainController.adminSignUp);
router.post('/admin_login', mainController.adminLogin);

// Protected route for admins
router.get('/admin_login', (req, res) => {
  res.render('adminLogin')
  // res.json({ message: 'You have access to the admin area.' });
});

router.get('/admin_signup', (req, res) => {
  res.render('adminSignUp')
})

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

router.get('/newsletter-success', checkFormSubmission, (req, res) => {
  res.render('newsletter-success');
})

router.get('/forbidden', (req, res) => {
  res.render('403')
})

router.get('/not_admin', (req, res) => {
  res.render('notAdmin')
})

module.exports = router