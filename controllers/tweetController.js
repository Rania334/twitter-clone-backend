const Tweet = require("../models/Tweet");

const createTweet = async (req, res) => {
  try {
    const { content, image } = req.body;
    const tweet = new Tweet({ user: req.user.id, content, image });
    await tweet.save();
    res.status(201).json(tweet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTweets = async (req, res) => {
  try {
    const tweets = await Tweet.find()
      .populate("user", "name username")
      .populate({
        path: "comments",
        populate: { path: "user", select: "name username" },
      })
      .sort({ createdAt: -1 });

    res.status(200).json(tweets);
  } catch (error) {
    console.error("Error fetching tweets:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const deleteTweet = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (!tweet) return res.status(404).json({ message: "Tweet not found" });

    if (tweet.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    await tweet.deleteOne();
    res.json({ message: "Tweet deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const likeTweet = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (!tweet) return res.status(404).json({ message: "Tweet not found" });

    const userId = req.user.id;

    if (tweet.likes.includes(userId)) {
      tweet.likes = tweet.likes.filter(id => id.toString() !== userId);
      await tweet.save();
      return res.json({ message: "Tweet unliked", tweet });
    }
    tweet.likes.push(userId);
    await tweet.save();
    res.json({ message: "Tweet liked", tweet });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const retweetTweet = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (!tweet) return res.status(404).json({ message: "Tweet not found" });

    const userId = req.user.id;

    if (tweet.retweets.includes(userId)) {
      tweet.retweets = tweet.retweets.filter(id => id.toString() !== userId);
      await tweet.save();
      return res.json({ message: "Retweet removed", tweet });
    }
    tweet.retweets.push(userId);
    await tweet.save();
    res.json({ message: "Tweet retweeted", tweet });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createTweet, getTweets, deleteTweet, retweetTweet, likeTweet };
