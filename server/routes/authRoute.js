const { Router } = require('express');
const router = Router();
const User = require('../models/model');
const Newsletter = require('../models/newsletter')
const bcrypt = require('bcrypt');

const ensureAuthenticated = require('../middleware/auth')

router.get('/', (req, res) => {
    res.render('login')
});

router.get('/signup', (req, res) => {
    res.render('signup')
});

router.get('/home', ensureAuthenticated, (req, res) => {
    res.render('home')
});

router.get('/cart', ensureAuthenticated, (req, res) => {
    res.render('cart')
});

router.get('/checkout', ensureAuthenticated, (req, res) => {
    res.render('checkout')
});

router.get('/detail', ensureAuthenticated, (req, res) => {
    res.render('detail')
})

router.get('/shop', ensureAuthenticated, (req, res) => {
    res.render('shop')
})

router.get('/contact', ensureAuthenticated, (req, res) => {
    res.render('contact')
})

router.get('/forbidden', ensureAuthenticated, (req, res) => {
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

  // Newsletter Route
  router.post('/newsletter', async (req, res) => {
    try{
      const { name, email } = req.body;
      const newsletter = new Newsletter({ name, email })
      await newsletter.save();
      // res.status(201).json({ message: 'Newsletter submitted successfully' });
      res.redirect('/home')
    } catch (error) {
      console.error(error);
    res.status(500).json({ error: 'An error occurred while processing the request' });
    }
  })

  module.exports = router