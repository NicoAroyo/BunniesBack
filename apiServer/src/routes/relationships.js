import express from "express";
import Model from "../models/relationship.js";
import User from "../models/user.js";

export const relationshipsRouter = express.Router();

//SEND FRIEND REQ
relationshipsRouter.patch(
  "/send-friend-request/:receiverId",
  async (req, res) => {
    try {
      const { receiverId } = req.params;
      const senderId = req.body._id;
      const sender = await User.findById(senderId);
      const receiver = await User.findById(receiverId);
      //UPDATE SENDER - REQUESTS SENT
      sender.requestsSent.push(receiver._id);
      await User.findByIdAndUpdate(sender._id, sender);

      //UPDATE RECEIVER - REQUESTS RECEIVED
      receiver.requestsReceived.push(sender._id);
      await User.findByIdAndUpdate(receiver._id, receiver);

      res.status(201).json({ user: sender });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

//WITHDRAW FRIEND REQ
relationshipsRouter.patch(
  "/withdraw-friend-request/:receiverId",
  async (req, res) => {
    try {
      const { receiverId } = req.params;
      const senderId = req.body._id;
      const sender = await User.findById(senderId);
      const receiver = await User.findById(receiverId);

      //UPDATE SENDER - REQUESTS SENT
      const newSender = sender.requestsSent.filter(
        (req) => req === receiver._id
      );
      const updatedSender = await User.findByIdAndUpdate(sender._id, {
        requestsSent: newSender,
      });

      //UPDATE RECEIVER - REQUESTS RECEIVED
      const newReciever = receiver.requestsReceived.filter(
        (req) => req === sender._id
      );
      await User.findByIdAndUpdate(receiver._id, {
        requestsReceived: newReciever,
      });
      res.status(201).json({ user: updatedSender });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

//ACCEPT FRIEND REQ
relationshipsRouter.patch(
  "/accept-friend-request/:senderId",
  async (req, res) => {
    try {
      const { senderId } = req.params;
      const receiverId = req.body._id;
      const receiver = await User.findById(receiverId);
      const sender = await User.findById(senderId);
      console.log(receiver);
      console.log(sender);

      //UPDATE SENDER - REQUESTS SENT, FRIENDS
      const newRequestsSent = sender.requestsSent.filter(
        (req) => req === receiver._id
      );
      await User.findByIdAndUpdate(sender._id, {
        requestsSent: newRequestsSent,
        friends: sender.friends.push(receiver._id),
      });

      //UPDATE RECEIVER - REQUESTS RECEIVED, FRIENDS
      const newRequestsReceived = receiver.requestsReceived.filter(
        (req) => req === sender._id
      );
      const updatedReceiver = await User.findByIdAndUpdate(receiver._id, {
        friends: receiver.friends.push(sender._id),
        requestsReceived: newRequestsReceived,
      });
      res.status(201).json({ user: updatedReceiver });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

//REJECT FRIEND REQ
relationshipsRouter.patch(
  "/reject-friend-request/:senderId",
  async (req, res) => {
    try {
      const { senderId } = req.params;
      const receiverId = req.body._id;
      const sender = await User.findById(senderId);
      const receiver = await User.findById(receiverId);

      //UPDATE SENDER - REQUESTS SENT
      const newRequestsSent = sender.requestsSent.filter(
        (req) => req === receiver._id
      );
      await User.findByIdAndUpdate(sender._id, {
        requestsSent: newRequestsSent,
      });

      //UPDATE RECEIVER - REQUESTS RECEIVED, FRIENDS
      const newRequestsReceived = receiver.requestsReceived.filter(
        (req) => req === sender._id
      );
      const updatedReceiver = await User.findByIdAndUpdate(receiver._id, {
        requestsReceived: newRequestsReceived,
      });
      res.status(201).json({ user: updatedReceiver });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

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

relationshipsRouter.get("/get-friends/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    const promises = user.friends.map((friendId) => {
      return User.findById(friendId);
    });
    const friends = await Promise.all(promises);
    res.status(200).json(friends);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
  // try {
  //   const data = await Model.find({
  //     userId1: req.params.userId,
  //     type: "friends",
  //   });
  //   const data2 = await Model.find({
  //     userId2: req.params.userId,
  //     type: "friends",
  //   });
  //   const friends = data.map(async (r) => {
  //     const user = await User.findById(r.userId2);
  //     console.log(user);
  //     if (user !== null) {
  //       const friend = { id: r._id, friend: user };
  //       return friend;
  //     } else return;
  //   });
  //   console.log(friends);
  //   const friends2 = data2.map(async (r) => {
  //     const user = await User.findById(r.userId1);
  //     console.log(user);
  //     if (user !== null) {
  //       const friend = { id: r._id, friend: user };
  //       return friend;
  //     } else return;
  //   });
  //   const all = await Promise.all([...friends, ...friends2]);
  //   res.json(all.filter((x) => x));
  // } catch (error) {
  //   res.send(500).json({ message: error.message });
  // }
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

// relationshipsRouter.post("/add-friend/:userId", async (req, res) => {
//   const { userId } = req.params;
//   const { user } = req.body;
//   user.frineds.push(userId);
//   const updatedUser = await User.findByIdAndUpdate(user._id, user);
// });

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
    const allUsers = await User.find();
    const allRelationships = await Model.find({
      $or: [{ userId1: userId }, { userId2: userId }],
    });
    const all = allUsers.map((element) => {
      const monker = allRelationships.find((u) => {
        const id = element._id.toString();
        return u.userId1 === id || u.userId2 === id;
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
      const request = { req: r, requested: user };
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
