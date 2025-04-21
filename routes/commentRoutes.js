const express = require("express");
const authenticateToken = require("../middleware/authMiddleware");
const { addComment, replyToComment, likeComment, getCommentsForTweet ,deleteComment } = require("../controllers/commentController");

const router = express.Router();

router.post("/add", authenticateToken, addComment);
router.post("/reply", authenticateToken, replyToComment);
router.put("/like/:commentId", authenticateToken, likeComment);
router.get("/:tweetId", authenticateToken, getCommentsForTweet);
router.delete("/deleteTweet/:commentId", authenticateToken, deleteComment);


module.exports = router;
