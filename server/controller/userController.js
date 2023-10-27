const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const User = require('../models/model');
 
 // Sign Up Controller
 exports.signUp = async (req, res) => {
    // Validation checks
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Create a session
    req.session.user = {
      // Other user information
      isSignedUp: true
    };
  
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

// Logout Controller
exports.logOut = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
          console.error(err);
        }
        res.redirect('/');
      });
}
