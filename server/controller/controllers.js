const Newsletter = require('../models/newsletter')

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
        res.json(newsletters); // Example for rendering a view
        // res.json({ newsletters }); // Example for sending newsletters as JSON
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while processing the request' });
      }
  }