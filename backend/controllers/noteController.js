const Note = require('../models/Note');
const Ticket = require('../models/Ticket');

// Description: Get all notes for a ticket
// Route: GET /api/tickets/:ticketId/notes
// Access: Private
const getNotes = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.ticketId);

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        // Customers can only see notes on their own tickets
        if (ticket.user.toString() !== req.user.id && req.user.role === 'customer') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const notes = await Note.find({ ticket: req.params.ticketId });
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Description: Add a note to a ticket
// Route: POST /api/tickets/:ticketId/notes
// Access: Private
const addNote = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.ticketId);

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        // Customers can only add notes to their own tickets
        if (ticket.user.toString() !== req.user.id && req.user.role === 'customer') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const note = await Note.create({
            text: req.body.text,
            isStaff: req.user.role !== 'customer', // True if agent or admin
            ticket: req.params.ticketId,
            user: req.user.id,
        });

        // 🟢 Real-Time Update: Broadcast the new note to the ticket's room
        const io = req.app.get('io');
        if (io) {
            io.to(req.params.ticketId).emit('new_note', note);
        }

        res.status(201).json(note);

        // 🟢 EMAIL NOTIFICATION 
        if (req.user.role !== 'customer') {
            try {
                // Dynamically fetch the customer's email from the original ticket reference
                const populatedTicket = await Ticket.findById(req.params.ticketId).populate('user', 'email');
                if (populatedTicket && populatedTicket.user && populatedTicket.user.email) {
                    const sendEmail = require('../utils/sendEmail');
                    await sendEmail({
                        email: populatedTicket.user.email,
                        subject: `New Agent Reply on Ticket: ${populatedTicket.product}`,
                        message: `A support agent has replied to your ticket with the following note:\n\n"${req.body.text}"\n\nPlease log in to the Helpdesk portal to respond.`
                    });
                }
            } catch (err) {
                console.error("Email sending failed:", err);
            }
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Description: Delete a note
// Route: DELETE /api/tickets/:ticketId/notes/:noteId
// Access: Private (Staff only)
const deleteNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.noteId);

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        // Only staff (agent/admin) or the note's own author can delete
        if (note.user.toString() !== req.user.id && req.user.role === 'customer') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await note.deleteOne();
        res.status(200).json({ message: `Note ${req.params.noteId} deleted` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getNotes, addNote, deleteNote };
