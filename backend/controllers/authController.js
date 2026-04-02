const User = require('../models/User');
const bcrypt = require('bcryptjs'); // Used to scramble passwords

// Description: Register a new user
// Route: POST /api/users/register
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Check if they filled out all the fields
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please include all fields" });
        }

        // 2. Check if the user already exists in the database
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // 3. Scramble (Hash) the password securely
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Finally, create the user in MongoDB
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // 5. Send a success message back
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Description: Authenticate a user
// Route: POST /api/users/login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // 1. Check if user exists looking up their email
    const user = await User.findOne({ email });

    // 2. Check if password matches the scrambled password in the database
    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id) // Hand them their JWT Wristband!
        });
    } else {
        res.status(401).json({ message: "Invalid email or password" });
    }
};

const jwt = require('jsonwebtoken');

// Generate JWT (This is the VIP Wristband)
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};
// Description: Get current logged in user
// Route: GET /api/users/me
// Access: Private (Requires Token!)
const getMe = async (req, res) => {
    // Because they passed the security guard, we already know who they are!
    res.status(200).json(req.user);
};

module.exports = {
    registerUser,
    loginUser,
    getMe
};
