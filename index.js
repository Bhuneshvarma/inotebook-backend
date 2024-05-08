/* eslint-disable no-undef */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectToMongo = require('./db');
const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectToMongo();

// Define allowed origins
const allowedOrigins = ['https://bhuneshvarma.github.io'];

// CORS configuration
app.use(cors({
    origin: allowedOrigins, // Allow requests from specific origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
    credentials: true // Allow credentials (e.g., cookies)
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

// Root route
app.get('/', (req, res) => {
    res.send("iNotebook is running");
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
