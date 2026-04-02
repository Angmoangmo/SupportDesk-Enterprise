const express = require('express');
const router = express.Router();

const {
    getTickets,
    getTicket,
    createTicket,
    updateTicket,
    deleteTicket,
    getTicketStats
} = require('../controllers/ticketController');

// Import the security guard middleware
const { protect } = require('../middleware/authMiddleware');

// All ticket routes are PRIVATE - protect is applied to all of them!
router.route('/')
    .get(protect, getTickets)      // GET all tickets
    .post(protect, createTicket);  // CREATE a new ticket

router.route('/stats')
    .get(protect, getTicketStats); // GET aggregation stats

router.route('/:id')
    .get(protect, getTicket)       // GET a single ticket
    .put(protect, updateTicket)    // UPDATE a ticket status
    .delete(protect, deleteTicket);// DELETE a ticket

module.exports = router;
