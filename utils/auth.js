const jwt = require("jsonwebtoken");

// Generate short-lived access token
const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user.id, username: user.username }, 
        process.env.JWT_ACCESS_SECRET, 
        { expiresIn: "15m" } // Short-lived access token
    );
};

// Generate long-lived refresh token
const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id }, 
        process.env.JWT_REFRESH_SECRET, 
        { expiresIn: "7d" }
    );
};

module.exports = { generateAccessToken, generateRefreshToken };
