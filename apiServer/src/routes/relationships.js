import express from "express";
import Model from "../models/relationship.js";
import User from "../models/user.js";


export const relationshipsRouter = express.Router();

//Post Method
relationshipsRouter.post("/", async (req, res) => {
  console.log("hi"  + req.body);
  const data = new Model({
    userId1: req.body.userId1,
    userId2: req.body.userId2,
    type : req.body.type
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
    const data = await Model.find({userId1 : req.params.userId
    , type : "friends"});
    const data2 = await Model.find({userId2 : req.params.userId
        , type : "friends"});
    const friends = data.map(
          (r) =>   User.findById(r.userId2)
        ); 
    const friends2 =  data2.map(
             (r) =>  User.findById(r.userId1)
        );
       console.log(friends);
      const all = await Promise.all([...friends, ...friends2]);
      console.log(all);
      res.json(all);
    } catch (error) {
      res.send(500).json({ message: error.message });
    }
  });


  relationshipsRouter.get("/getBlocked/:userId", async (req, res) => {
    try {
      const data = await Model.find({userId1 : req.params.userId
       , type : "blocked"});
       const data2 = await Model.find({userId2 : req.params.userId , type : "blocked"});
      res.json(...data , ...data2);
    } catch (error) {
      res.send(500).json({ message: error.message });
    }
  });

  relationshipsRouter.get("/getBlockedByYou/:userId", async (req, res) => {
    try {
      const data = await Model.find({userId1 : req.params.userId
       , type : "blocked"});
      res.json(data);
    } catch (error) {
      res.send(500).json({ message: error.message });
    }
  });


  relationshipsRouter.get("/getRequested/:userId", async (req, res) => {
    try {
      const data = await Model.find({userId2 : req.params.userId
       , type : "request"});
    console.log(data);
      res.json(data);
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
