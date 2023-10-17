const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    subject: {
        type: String,
        require: true,
    },
    message: {
        type: String,
        require: true,
    }
})
const ContactForm = mongoose.model('contactForm', contactSchema)

module.exports = ContactForm;