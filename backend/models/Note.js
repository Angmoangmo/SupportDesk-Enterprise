const mongoose = require('mongoose');

const noteSchema = mongoose.Schema(
    {
        // Which ticket does this note belong to?
        ticket: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Ticket',
        },
        // Who wrote this note?
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        text: {
            type: String,
            required: [true, 'Please add a note'],
        },
        // Flag: was this note written by a support agent/admin?
        isStaff: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt automatically
    }
);

module.exports = mongoose.model('Note', noteSchema);
