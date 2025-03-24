const User = require("../models/User");
const bcrypt = require("bcrypt");

// Get user by username
exports.getUserByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Update user profile
exports.updateUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    let updatedData = { name, username, email };

    // If password is updated, hash it
    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(req.user.id, updatedData, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};
