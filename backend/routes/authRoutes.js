const express = require('express');
const router = express.Router();

// 1. IMPORT BOTH FUNCTIONS NOW
const { registerUser, loginUser,getMe } = require('../controllers/authController');
// MUST IMPORT THE SECURITY GUARD!
const { protect } = require('../middleware/authMiddleware');

// 2. THE REGISTER HIGHWAY
router.post('/register', registerUser);

// 3. THE LOGIN HIGHWAY (THIS WAS MISSING!)
router.post('/login', loginUser);
// Notice how 'protect' is standing right in the middle!
router.get('/me', protect, getMe);

// 🪄 MAGIC ADMIN CHEAT CODE ROUTE
// This instantly grants all current users the 'admin' status
router.get('/make-me-admin', async (req, res) => {
    try {
        const User = require('../models/User');
        await User.updateMany({}, { role: 'admin' });
        res.send("<div style='font-family: sans-serif; padding: 40px; text-align: center;'><h1>Magic! 🪄</h1><h2>Your user account is now an Admin in the backend database!</h2><br/><p><strong>1. Close this tab and go back to your App.</strong></p><p><strong>2. Click 'Logout'.</strong></p><p><strong>3. Log back in again!</strong></p></div>");
    } catch(err) {
        res.send("Error " + err.message);
    }
});

module.exports = router;
