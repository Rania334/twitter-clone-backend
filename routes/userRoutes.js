const express = require("express");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Protected route
router.get("/profile", authenticateToken, (req, res) => {
    res.json({ message: "Profile data", user: req.user });
});

module.exports = router;
