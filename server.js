const express = require('express')
const app = express()
require('dotenv').config()
const path = require('path')
const hbs = require('hbs')

// View Engine
const templatePath = path.join(__dirname, './views');
app.set('view engine', 'hbs');
app.set('views', templatePath);

// Serve static files from the 'public' directory
app.use(express.static('public'))  

// Routes
const storeRoute = require('./routes/route')
app.use(storeRoute)

// Start the Server  
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})