const { Router } = require('express');
const router = Router();
const User = require('../models/model');
const bcrypt = require('bcrypt');
const newsletterController = require('../controller/controllers')
const contactController = require('../controller/controllers')

const ensureAuthenticated = require('../middleware/auth')
const checkFormSubmission = require('../middleware/formAuth')

router.post('/newsletter', newsletterController.createNewsletter);
router.get('/api/v1/newsletter', newsletterController.getNewsletter);
router.post('/contact_form', contactController.createContact)
router.get('/api/v1/contact_form', contactController.getContact)

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

router.post('/signup', async(req, res) => {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    
        const data = {
          username: req.body.username,
          password: hashedPassword,
        };
        
        await User.insertMany([data]);
        // res.status(201).json({ msg: 'account created successfully'})
        res.status(201).render('home')
      } catch (error) {
        res.send('An error occurred while signing up.');
      }  
});

router.post('/login', async(req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
    
        if (!user) {
          return res.send('User not found');
        }
        const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    
        if (passwordMatch) {
          req.session.user = user;
          res.status(201).render('home');
        } else {
          res.send('Incorrect password');
        }
      } catch (error) {
        res.send('An error occurred while logging in.');
      }
});

  // Logout route
  router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
      }
      res.redirect('/');
    });
  });

  module.exports = router