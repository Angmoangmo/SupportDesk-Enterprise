const express = require('express');
// mergeParams: true is CRITICAL — it lets us access :ticketId from the parent route
const router = express.Router({ mergeParams: true });

const { getNotes, addNote, deleteNote } = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');

// All note routes are nested under /api/tickets/:ticketId/notes
router.route('/')
    .get(protect, getNotes)   // GET all notes for a ticket
    .post(protect, addNote);  // POST (add) a note to a ticket

router.route('/:noteId')
    .delete(protect, deleteNote); // DELETE a specific note

module.exports = router;
