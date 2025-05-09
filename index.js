const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./apis');
require('dotenv').config();  // Load .env file

const app = express();
const port = process.env.PORT || 3001;  // Use environment port or fallback to 3001

// Enable CORS for multiple origins (adjust according to your needs)
app.use(cors({
    origin: ['http://localhost:3002', 'http://localhost:3000', 'https://your-deployed-frontend-url.com'],
    credentials: true
}));

// Middleware to parse JSON bodies
app.use(express.json());

// MongoDB connection URL
const MONGO_URL = process.env.MONGO_URL;

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

// Use user routes for /user prefix
app.use('/user', userRoutes);

// Start the server
app.listen(port, () => {
    console.log(`🚀 Server is running on port: ${port}`);
});
