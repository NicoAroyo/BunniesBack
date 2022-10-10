import express from "express";
import User from "../models/user.js";
import Post from "../models/post.js";
import Relationship from "../models/relationship.js";

export const profileRouter = express.Router();

profileRouter.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    const posts = await Post.find({ userId });
    const friends = await Promise.all(
      user.friends.map((friend) => User.findById(friend))
    );

    const ret = { user, posts, friends };
    res.status(200).json(ret);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
