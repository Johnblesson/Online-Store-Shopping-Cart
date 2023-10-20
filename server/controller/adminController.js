const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const User = require('../models/model')

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