import express from "express";
import Post from "../models/post.js";

export const postsRouter = express.Router();

//Post Method
postsRouter.post("/", async (req, res) => {
  console.log(req.body);
  const data = new Post({
    content: req.body.content,
    userId: req.body.userId,
    imageUrl: req.body.imageUrl,
    privacy: req.body.privacy,
    location: req.body.location,
  });

  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Get all Method
postsRouter.get("/", async (req, res) => {
  try {
    const data = await Post.find();
    res.json(data);
  } catch (error) {
    res.send(500).json({ message: error.message });
  }
});

//Get by ID Method
postsRouter.get("/:id", async (req, res) => {
  try {
    const data = await Post.findById(req.params.id);
    res.json(data);
  } catch (error) {
    res.send(500).json({ message: error.message });
  }
});

postsRouter.get("/getPostsByUser/:userId", async (req, res) => {
  try {
    const data = await Post.find({ userId: req.params.userId });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Update by ID Method
postsRouter.patch("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };
    const result = await Post.findByIdAndUpdate(id, updatedData, options);
    res.send(result);
  } catch (error) {
    res.send(400).json({ message: error.message });
  }
});

//Delete by ID Method
postsRouter.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Post.findByIdAndDelete(id);
    res.send(`${data} deleted`);
  } catch (error) {
    res.send(400).json({ message: error.message });
  }
});
