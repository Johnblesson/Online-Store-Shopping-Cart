const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const User = require('../models/model');
const Newsletter = require('../models/newsletter');
const ContactForm = require('../models/contact')

    // Sign Up Controller
    exports.signUp = async (req, res) => {
        // Validation checks
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
      
        try {
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
      
          const userData = {
            username: req.body.username,
            password: hashedPassword,
          };
      
          // Check for duplicate usernames
          const existingUser = await User.findOne({ username: userData.username });
          if (existingUser) {
            return res.status(400).json({ error: 'Username is already taken' });
          }
      
          // Ensure the password contains at least one uppercase letter, one lowercase letter, and is at least 6 characters long
          if (!/^(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(req.body.password)) {
            return res.status(400).json({
              error: 'Password must be at least 6 characters long and contain both uppercase and lowercase letters.',
            });
          }
      
          await User.create(userData);
          res.status(201).render('home');
        } catch (error) {
          console.error(error);
          res.status(500).send('An error occurred while signing up.');
        }
      };

    // Login Controller
    exports.logIn = async (req, res) => {
        try {
        const { username, password, role } = req.body;
        const user = await User.findOne({ username, role });
      
        if (user && (await bcrypt.compare(password, user.password))) {
            req.session.user = user;
        //   res.json({ message: 'Logged in successfully' });
            res.status(201).render('home');
        } else {
            res.status(401).json({ error: 'Authentication failed' });
        }
    }
    catch (error) {
        res.send('An error occurred while logging in.', error );
    }
};
    
    // Admin Sign Up
    exports.adminSignUp = async (req, res) => {
    // Validation checks
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const userData = {
      username: req.body.username,
      password: hashedPassword,
      role: req.body.role,
    };

    // Check for duplicate usernames
    const existingUser = await User.findOne({ username: userData.username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username is already taken' });
    }

    // Ensure the password contains at least one uppercase letter, one lowercase letter, and is at least 6 characters long
    if (!/^(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(req.body.password)) {
      return res.status(400).json({
        error: 'Password must be at least 6 characters long and contain both uppercase and lowercase letters.',
      });
    }

    // Check for a valid role (either 'user' or 'admin')
    if (userData.role !== 'user' && userData.role !== 'admin') {
      return res.status(400).json({ error: 'Invalid role. Role must be either "user" or "admin".' });
    }

    await User.create(userData);
    res.status(201).render('home');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while signing up.');
  }
};


    // Admin Login
    exports.adminLogin = async (req, res) => {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
      
        if (user && user.role === 'admin' && (await bcrypt.compare(password, user.password))) {
          req.session.user = user;
          res.render('home'); // Render the admin home page or redirect to an admin dashboard
        } else {
          res.status(401).render('notAdmin');
        }
      }

    // Logout Controller
    exports.logOut = (req, res) => {
        req.session.destroy((err) => {
            if (err) {
              console.error(err);
            }
            res.redirect('/');
          });
    }

  // Create Newsletter
  exports.createNewsletter = async (req, res) => {
    try{
        const { name, email } = req.body;
        const newsletter = new Newsletter({ name, email })
        await newsletter.save();
        // res.status(201).json({ message: 'Newsletter submitted successfully' });
        res.render('newsletter-success')
      } catch (error) {
        console.error(error);
      res.status(500).json({ error: 'An error occurred while processing the request' });
      }
  }

  //Get all Newsletter
  exports.getNewsletter = async(req, res) => {
    try {
        // Fetch newsletters from your database or any other data source
        const newsletters = await Newsletter.find(); // Assuming you have a model called "Newsletter"
    
        // Render a view or send newsletters as JSON, depending on your application's needs
        // res.json(newsletters); // Example for rendering a view
        res.json({ newsletters }); 
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while processing the request' });
      }
  }

  // Create a contact
  exports.createContact = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        const contact = new ContactForm({ name, email, subject, message })
        await contact.save();
        // res.status(201).json({ message: 'Contact form submitted successfully' });
        // res.render('contact-success')

    // Set a session variable to indicate successful form submission
    req.session.formSubmitted = true;

    // Redirect to the success page
    res.redirect('/contact-success');
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while processing the request' });
    }
  }

  // Get all contact form
  exports.getContact = async (req, res) => {
    try {
        const contacts = await ContactForm.find();
        res.json({ contacts })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while processing the request' });
    }
  }
