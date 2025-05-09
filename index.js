const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');  // <-- Import CORS
const userRoutes = require('./apis');  // Import routes
require('dotenv').config();  // Load .env file for environment variables


const app = express();
const port = 3001;

// Enable CORS for frontend at http://localhost:3000
app.use(cors({
    origin: 'http://localhost:3002',
    credentials: true
}));

// Middleware to parse JSON bodies
app.use(express.json());

// MongoDB connection URL from .env file
const MONGO_URL = process.env.MONGO_URL;

// Connect to MongoDB
mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("✅ Connected to MongoDB successfully");
})
.catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
});

// Use user routes for "/user" prefix
app.use('/user', userRoutes);

// Start the server
app.listen(port, () => {
    console.log(`🚀 Server is running on port: ${port}`);
});
