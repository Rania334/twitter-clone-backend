const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { generateAccessToken, generateRefreshToken } = require("../utils/auth");

const router = express.Router();

// Register a user
router.post("/register", async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        // Check if user already exists
        let userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({ name, username, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login user
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid email or password" });

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

        // Generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Store refresh token in HTTP-Only Secure Cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true, // Prevent JavaScript access (protects from XSS)
            secure: true,   // Only send over HTTPS
            sameSite: "Strict", // Prevent CSRF
        });

        res.json({ accessToken });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
