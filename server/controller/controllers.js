const Newsletter = require('../models/newsletter');
const ContactForm = require('../models/contact')

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
