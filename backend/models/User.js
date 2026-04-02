const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true // No two users can have the same email!
    },
    password: {
        type: String,
        required: [true, 'Please add a password']
    },
    role: {
        type: String,
        enum: ['customer', 'agent', 'admin'], // These are the only 3 roles allowed
        default: 'customer' // everyone who signs up is a customer by default
    }
}, {
    timestamps: true // This automatically adds "createdAt" and "updatedAt" times
});

module.exports = mongoose.model('User', userSchema);
