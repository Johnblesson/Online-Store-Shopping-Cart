const mongoose = require('mongoose')

const newsletterSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    }
})

const Newsletter = mongoose.model('newsletter', newsletterSchema)

module.exports = Newsletter;