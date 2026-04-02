const Ticket = require('../models/Ticket');
const User = require('../models/User');

// Description: Get all tickets for logged in user (or all tickets for agent/admin)
// Route: GET /api/tickets
// Access: Private
const getTickets = async (req, res) => {
    try {
        // If user is a customer, show only their tickets
        // If agent or admin, show ALL tickets
        let tickets;
        if (req.user.role === 'customer') {
            tickets = await Ticket.find({ user: req.user.id });
        } else {
            tickets = await Ticket.find().populate('user', 'name email');
        }
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Description: Get single ticket
// Route: GET /api/tickets/:id
// Access: Private
const getTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id).populate('user', 'name email');

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        // Make sure the logged in user owns this ticket (unless agent/admin)
        if (ticket.user._id.toString() !== req.user.id && req.user.role === 'customer') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.status(200).json(ticket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Description: Create new ticket
// Route: POST /api/tickets
// Access: Private
const createTicket = async (req, res) => {
    try {
        const { product, description, priority } = req.body;

        if (!product || !description) {
            return res.status(400).json({ message: 'Please add a product and description' });
        }

        const ticket = await Ticket.create({
            product,
            description,
            priority: priority || 'low',
            status: 'new',
            user: req.user.id  // The logged in user is automatically the owner
        });

        res.status(201).json(ticket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Description: Update a ticket status (Agent/Admin only)
// Route: PUT /api/tickets/:id
// Access: Private
const updateTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        const updatedTicket = await Ticket.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // This returns the NEW updated version of the ticket
        );

        res.status(200).json(updatedTicket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Description: Delete a ticket
// Route: DELETE /api/tickets/:id
// Access: Private
const deleteTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        await ticket.deleteOne();
        res.status(200).json({ message: `Ticket ${req.params.id} deleted` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Description: Get ticket statistics (Aggregation)
// Route: GET /api/tickets/stats
// Access: Private (Agent/Admin)
const getTicketStats = async (req, res) => {
    try {
        if (req.user.role === 'customer') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const statusStats = await Ticket.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const priorityStats = await Ticket.aggregate([
            {
                $group: {
                    _id: '$priority',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({ statusStats, priorityStats });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTickets,
    getTicket,
    createTicket,
    updateTicket,
    deleteTicket,
    getTicketStats
};
