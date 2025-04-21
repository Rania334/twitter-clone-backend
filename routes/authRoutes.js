const express = require("express");
const { registerUser, loginUser ,logoutUser ,refreshToken } = require("../controllers/userController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/refresh-token", refreshToken);
module.exports = router;
