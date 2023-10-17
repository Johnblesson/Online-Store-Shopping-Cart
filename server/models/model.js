const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        // maxLength: 6,
    },
    password: {
        type: String,
        require: true,
        // maxLength: 6,
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Define the allowed roles
        default: 'user', // Set the default role to 'admin'
        required: false,
      },
})

const User = mongoose.model('credentials', userSchema)

module.exports = User;