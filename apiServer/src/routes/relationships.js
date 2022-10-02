import express from "express";
import Model from "../models/relationship.js";
import User from "../models/user.js";

export const relationshipsRouter = express.Router();

//Post Method
relationshipsRouter.post("/", async (req, res) => {
  console.log("hi" + req.body);
  const data = new Model({
    userId1: req.body.userId1,
    userId2: req.body.userId2,
    type: req.body.type,
  });
  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Get all Method
relationshipsRouter.get("/", async (req, res) => {
  try {
    const data = await Model.find();
    res.json(data);
  } catch (error) {
    res.send(500).json({ message: error.message });
  }
});

//Get by ID Method
relationshipsRouter.get("/:id", async (req, res) => {
  try {
    const data = await Model.findById(req.params.id);
    res.json(data);
  } catch (error) {
    res.send(500).json({ message: error.message });
  }
});

relationshipsRouter.get("/getFriends/:userId", async (req, res) => {
  try {
    const data = await Model.find({
      userId1: req.params.userId,
      type: "friends",
    });
    const data2 = await Model.find({
      userId2: req.params.userId,
      type: "friends",
    });
    const friends = data.map(async (r) => {
      const user = await User.findById(r.userId2);
      const friend = { id: r._id, friend: user };
      return friend;
    });
    const friends2 = data2.map(async (r) => {
      const user = await User.findById(r.userId1);
      const friend = { id: r._id, friend: user };
      return friend;
    });
    const all = await Promise.all([...friends, ...friends2]);
    res.json(all);
  } catch (error) {
    res.send(500).json({ message: error.message });
  }
});

relationshipsRouter.get("/getBlocked/:userId", async (req, res) => {
  try {
    const data = await Model.find({
      userId1: req.params.userId,
      type: "blocked",
    });
    const data2 = await Model.find({
      userId2: req.params.userId,
      type: "blocked",
    });
    const blocked = data.map(async (r) => {
      const user = await User.findById(r.userId2);
      const block = { id: r._id, blocked: user };
      return block;
    });
    const blocked2 = data2.map(async (r) => {
      const user = await User.findById(r.userId1);
      const block = { id: r._id, blocked: user };
      return block;
    });
    const all = await Promise.all([...blocked, ...blocked2]);
    res.json(all);
  } catch (error) {
    res.send(500).json({ message: error.message });
  }
});

relationshipsRouter.get("/getBlockedByYou/:userId", async (req, res) => {
  try {
    const data = await Model.find({
      userId1: req.params.userId,
      type: "blocked",
    });
    const blocked = data.map(async (r) => {
      const user = await User.findById(r.userId2);
      const block = { id: r._id, blocked: user };
      return block;
    });
    const all = await Promise.all([...blocked]);
    res.json(all);
  } catch (error) {
    res.send(500).json({ message: error.message });
  }
});

relationshipsRouter.get("/getRelevantUsers/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    let allUsers = await User.find();
    const allRelationships = await Model.find({
      $or: [{ userId1: userId }, { userId2: userId }],
    });
    console.log(allRelationships);
    const all = allUsers.map((element) => {
      const monker = allRelationships.find((u) => {
        return (
          u.userId1 === element._id.toString() ||
          u.userId2 === element._id.toString()
        );
      });
      if (!monker) return element;
    });
    res.json(all);
  } catch (error) {
    res.send(600).json({ message: error.message });
  }
});

relationshipsRouter.get("/getRequested/:userId", async (req, res) => {
  try {
    const data = await Model.find({
      userId2: req.params.userId,
      type: "request",
    });
    const requested = data.map(async (r) => {
      const user = await User.findById(r.userId2);
      const request = { id: r._id, blocked: user };
      return request;
    });
    const all = await Promise.all([...requested]);
    res.json(all);
  } catch (error) {
    res.send(500).json({ message: error.message });
  }
});

relationshipsRouter.patch("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };
    const result = await Model.findByIdAndUpdate(id, updatedData, options);
    res.send(result);
  } catch (error) {
    res.send(400).json({ message: error.message });
  }
});

//Delete by ID Method
relationshipsRouter.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Model.findByIdAndDelete(id);
    res.send(`${data} deleted`);
  } catch (error) {
    res.send(400).json({ message: error.message });
  }
});
