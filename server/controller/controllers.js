const User = require('../models/model');
const Newsletter = require('../models/newsletter');
const ContactForm = require('../models/contact')
const bcrypt = require('bcrypt');

    // Sign Up Controller
    exports.signUp = async (req, res) => {
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
        }
        catch (error) {
            res.send('An error occurred while signing up.');
        }
    }

    // Login Controller
    exports.logIn = async (req, res) => {
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
        }
        catch (error) {
            res.send('An error occurred while logging in.', error );
        }
    }

    // Admin Sign Up
    exports.adminSignUp = async (req, res) => {
        try{
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        
            const data = {
              username: req.body.username,
              password: hashedPassword,
              role: req.body.role,
            };
            
            await User.insertMany([data])
            res.status(201).render('home')
            // res.status(201).json({ message: 'User registered successfully' });
        }
        catch (error) {
            res.status(500).send('An error occurred while signing up.', error);
        }
    }

    // Admin Login
    exports.adminLogin = async (req, res) => {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username });
          
            if (user && (await bcrypt.compare(password, user.password))) {
              req.session.user = user;
            //   res.json({ message: 'Logged in successfully' });
            res.render('home')
            } else {
              res.status(401).json({ error: 'Authentication failed' });
            }
        }
        catch (error) {
            res.send('An error occurred while logging in.', error );
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
        res.redirect('/home')
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
