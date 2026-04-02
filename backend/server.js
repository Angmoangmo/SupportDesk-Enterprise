const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const http = require('http');
const socketIo = require('socket.io');

// 1️⃣ Load env variables FIRST
dotenv.config();

// 2️⃣ Connect to MongoDB AFTER env is loaded
connectDB();

// 3️⃣ Initialize app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*', // Adjust for production if necessary
        methods: ['GET', 'POST']
    }
});

app.set('io', io); // Make 'io' accessible deep within routes/controllers

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    
    // Clients will join a room named after the ticket ID
    socket.on('join_ticket', (ticketId) => {
        socket.join(ticketId);
        console.log(`User joined ticket room: ${ticketId}`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// 4️⃣ Middleware
app.use(cors());
app.use(express.json());

// 5️⃣ Routes
app.use('/api/users', require('./routes/authRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));
app.use('/api/tickets/:ticketId/notes', require('./routes/noteRoutes'));

// 6️⃣ Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));