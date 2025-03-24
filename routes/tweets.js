const express = require("express");
const Tweet = require("../models/Tweet");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const newTweet = new Tweet({ user: req.user.id, content: req.body.content });
    await newTweet.save();
    res.status(201).json(newTweet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const tweets = await Tweet.find().populate("user", "name profilePic").sort({ createdAt: -1 });
    res.json(tweets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id/like", authMiddleware, async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (!tweet.likes.includes(req.user.id)) {
      tweet.likes.push(req.user.id);
    } else {
      tweet.likes = tweet.likes.filter((id) => id.toString() !== req.user.id);
    }
    await tweet.save();
    res.json(tweet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
