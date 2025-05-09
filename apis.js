const express = require('express');
const router = express.Router();
const User = require('./models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;

const verifyToken = require('./authMiddleware');

// POST - Create User
router.post('/', async (req, res) => {
    const { name, email, gender, phoneNumber, professional, age, city, isMarried } = req.body;

    try {
        // Basic required fields validation
        if (!name || !email) {
            return res.status(400).json({ message: "Name and email are required" });
        }

        // Optional: Validate additional fields if needed (example below)
        if (age && isNaN(age)) {
            return res.status(400).json({ message: "Age must be a number" });
        }

        // Check if user already exists by email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User with the same email already exists" });
        }

        // Create new user with all fields
        const newUser = new User({
            name,
            email,
            gender,
            phoneNumber,
            professional,
            age,
            city,
            isMarried
        });

        await newUser.save();
        res.status(201).json({ message: "User created successfully", user: newUser });

    } catch (error) {
        console.error("Error occurred while creating user:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.post('/login/:email', async (req, res) => {
    const email = req.params.email;
    console.log("📩 Login request for:", email);

    try {
        if (!email) return res.status(400).json({ message: "Email is required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // ✅ Create JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            SECRET_KEY,
            { expiresIn: '1h' } // Valid for 1 hour
        );

        res.status(200).json({
            message: "Login successful",
            token: token,
            user: user
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


router.get('/dashboard', verifyToken, async (req, res) => {
    const userEmail = req.user.email;

    try {
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Dashboard data", user });
    } catch (error) {
        console.error("Error occurred while fetching user by email:", error);
        res.status(500).json({ message: "Server error", error });
    }
});



router.put('/', async (req, res) => {
    const { email } = req.query; // Use email from query
    const { name, phoneNumber, age, gender, city, isMarried } = req.body || {}; // Accept other fields

    if (!email) {
        return res.status(400).json({ message: "User email is required in query" });
    }

    // Validate that at least one field is provided
    if (!name && !phoneNumber && !age && !gender && !city && isMarried === undefined) {
        return res.status(400).json({ message: "At least one of the fields (name, phoneNumber, age, gender, city, isMarried) must be provided in the body" });
    }

    try {
        // Find the user by email                                                
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update fields if provided
        if (name) user.name = name;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (age) user.age = age;
        if (gender) user.gender = gender;
        if (city) user.city = city;
        if (isMarried !== undefined) user.isMarried = isMarried; // Handle boolean field

        // Save the updated user
        await user.save();

        res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        console.log("Error occurred while updating user:", error);
        res.status(500).json({ message: "Server error", error });
    }
});



// DELETE - Delete User by ID from query param
router.delete('/', async (req, res) => {
    const { id } = req.query;  // Extract ID from query

    try {
        if (!id) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await User.deleteOne({ _id: id });

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.log("Error occurred while deleting user:", error);
        res.status(500).json({ message: "Server error", error });
    }
});


module.exports = router;
