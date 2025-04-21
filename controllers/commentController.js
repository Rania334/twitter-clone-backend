const Comment = require("../models/Comment");
const Tweet = require("../models/Tweet");

const addComment = async (req, res) => {
  try {
    const { tweetId, content } = req.body;

    const comment = new Comment({
      user: req.user.id,
      tweet: tweetId,
      content,
    });



    await comment.save();
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }
    await Tweet.findByIdAndUpdate(tweetId, { $push: { comments: comment._id } });

    res.status(201).json(comment);
  } catch (error) {

    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const replyToComment = async (req, res) => {
  try {
    const { commentId, content } = req.body;

    const reply = new Comment({
      user: req.user.id,
      content,
    });

    await reply.save();

    await Comment.findByIdAndUpdate(commentId, { $push: { replies: reply._id } });

    res.status(201).json(reply);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const likeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);

    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const hasLiked = comment.likes.includes(req.user.id);

    if (hasLiked) {
      comment.likes = comment.likes.filter(id => id.toString() !== req.user.id);
    } else {
      comment.likes.push(req.user.id);
    }

    await comment.save();
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getCommentsForTweet = async (req, res) => {
  try {
    const { tweetId } = req.params;
    const comments = await Comment.find({ tweet: tweetId }).populate("user", "username").populate("replies");
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);

    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to delete this comment" });
    }

    await Tweet.findByIdAndUpdate(comment.tweet, { $pull: { comments: commentId } });
    await comment.deleteOne();

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


module.exports = { addComment, replyToComment, likeComment, getCommentsForTweet, deleteComment };
