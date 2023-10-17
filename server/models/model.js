const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Define the allowed roles
        default: 'admin', // Set the default role to 'admin'
        required: false,
      },
})

const User = mongoose.model('credentials', userSchema)

module.exports = User;