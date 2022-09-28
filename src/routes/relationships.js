import express from "express";
import Relationship from "../models/relationship.js";

export const relationshipsRouter = express.Router();

//Post Method
relationshipsRouter.post("/", async (req, res) => {
  console.log("hi" + req.body);
  const data = new Relationship({
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
    const data = await Relationship.find();
    res.json(data);
  } catch (error) {
    res.send(500).json({ message: error.message });
  }
});

//Get by ID Method
relationshipsRouter.get("/:id", async (req, res) => {
  try {
    const data = await Relationship.findById(req.params.id);
    res.json(data);
  } catch (error) {
    res.send(500).json({ message: error.message });
  }
});

relationshipsRouter.get("/getFriends/:userId", async (req, res) => {
  try {
    const data = await Relationship.find(
      { userId1: req.params.userId },
      { type: "friends" }
    );
    res.status(200).json(data || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

relationshipsRouter.get("/getBlocked/:userId", async (req, res) => {
  try {
    const data = await Relationship.find(
      { userId1: req.params.userId },
      { type: "blocked" }
    );
    res.json(data);
  } catch (error) {
    res.send(500).json({ message: error.message });
  }
});

relationshipsRouter.get("/getBlocks/:userId", async (req, res) => {
  try {
    const data = await Relationship.findOne(
      ({ userId1: req.params.userId } || { userId2: req.params.userId }) && {
        type: "blocked",
      }
    );
    res.json(data);
  } catch (error) {
    res.send(500).json({ message: error.message });
  }
});

//OPTIONAL FEATURE
//   relationshipsRouter.get("/getRequested/:userId", async (req, res) => {
//     try {
//       const data = await Model.findOne(({userId1 : req.params.userId}
//       || {userId2 : req.params.userId}) && {type : "blocked"});
//       res.json(data);
//     } catch (error) {
//       res.send(500).json({ message: error.message });
//     }
//   });

//OPTIONAL FOR REQUESTS
// relationshipsRouter.patch("/:id", async (req, res) => {
//   try {
//     const id = req.params.id;
//     const updatedData = req.body;
//     const options = { new: true };
//     const result = await Model.findByIdAndUpdate(id, updatedData, options);
//     res.send(result);
//   } catch (error) {
//     res.send(400).json({ message: error.message });
//   }
// });

//Delete by ID Method
relationshipsRouter.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Relationship.findByIdAndDelete(id);
    res.send(`${data} deleted`);
  } catch (error) {
    res.send(400).json({ message: error.message });
  }
});
