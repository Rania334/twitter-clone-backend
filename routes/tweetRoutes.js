const express = require("express");
const authenticateToken = require("../middleware/authMiddleware");
const { createTweet, getTweets, deleteTweet,likeTweet,retweetTweet } = require("../controllers/tweetController");

const router = express.Router();

router.post("/", authenticateToken, createTweet);
router.get("/", getTweets);
router.delete("/:id", authenticateToken, deleteTweet);
router.put("/:id/like", authenticateToken, likeTweet);
router.put("/:id/retweet", authenticateToken, retweetTweet);


module.exports = router;
