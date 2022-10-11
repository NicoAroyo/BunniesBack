import express from "express";
import group from "../models/group.js";
import Model from "../models/group.js";
import User from "../models/user.js";
import Post from "../models/post.js";
export const groupsRouter = express.Router();

//Post Method
groupsRouter.post("/", async (req, res) => {
  const data = new Model({
    name: req.body.name,
    creator: req.body.creator,
    privacy: req.body.privacy,
    memebers: req.body.memebers,
    admins: req.body.admins,
  });
  console.log(data);
  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Get all Method
groupsRouter.get("/", async (req, res) => {
  try {
    console.log("HI FROM GET");
    const data = await Model.find();
    console.log(data);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get by ID Method
groupsRouter.get("/getById/:id", async (req, res) => {
  try {
    const data = await Model.findById(req.params.id);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

groupsRouter.get("/getPublic", async (req, res) => {
  try {
    console.log("HI FROM GET");
    const data = await Model.find({ privacy: "public" });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

groupsRouter.get("/getAllInformation/:groupId", async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Model.findById(groupId);
    console.log(
      "🚀 ~ file: groups.js ~ line 62 ~ groupsRouter.get ~ group",
      group.memebers
    );
    console.log(group.memebers);
    const members = group.memebers?.map(async (request) => {
      return await User.findById(request);
    });
    const requests = group.requests?.map(async (request) => {
      return await User.findById(request);
    });
    const posts = group.posts?.map(async (post) => {
      return await Post.findById(post);
    });
    const admins = group.admins?.map(async (admins) => {
      return await User.findById(admins);
    });
    console.log(members);
    const dataMembers = await Promise.all([...members]);
    const dataAdmins = await Promise.all([...admins]);
    const dataPosts = await Promise.all([...posts]);
    const dataRequests = await Promise.all([...requests]);

    const ret = { dataMembers, dataAdmins, dataPosts, dataRequests, group };
    res.status(200).json(ret);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Update by ID Method
groupsRouter.patch("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };
    const result = await Model.findByIdAndUpdate(id, updatedData, options);
    res.status.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Delete by ID Method
groupsRouter.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Model.findByIdAndDelete(id);
    res.status(204).send(`${data} deleted`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

groupsRouter.patch("/requestToJoin/:groupId", async (req, res) => {
  try {
    const { groupId } = req.params;
    const { sender } = req.body;
    const group = await Model.findById(groupId);

    // UPDATE RECEIVER - REQUESTS RECEIVED

    group.requests.push(sender._id);
    await Model.findByIdAndUpdate(groupId, {
      requests: group.requests,
    });

    res.status(201);
  } catch (error) {
    res.status(400).json(error);
  }
});

groupsRouter.patch("/acceptJoinRequest/:groupId", async (req, res) => {
  try {
    const { groupId } = req.params;
    const { sender } = req.body;
    const group = await Model.findById(groupId);

    // UPDATE RECEIVER - REQUESTS RECEIVED
    const groupReq = group.requests.filter(
      (x) => x._id.toString() !== sender._id.toString()
    );
    await Model.findByIdAndUpdate(groupId, {
      requests: groupReq,
      members: group.memebers.push(sender._id),
    });

    res.status(201);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

groupsRouter.patch("/cancelRequest/:groupId", async (req, res) => {
  try {
    const { groupId } = req.params;
    const { sender } = req.body;
    const group = await Model.findById(groupId);
    console.log("hi", group);

    // UPDATE RECEIVER - REQUESTS RECEIVED
    const groupReq = group.requests.filter(
      (x) => x.toString() !== sender._id.toString()
    );
    await Model.findByIdAndUpdate(groupId, {
      requests: [...groupReq],
    });

    res.status(201);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

groupsRouter.patch("/leaveGroup/:groupId", async (req, res) => {
  try {
    const { groupId } = req.params;
    const { sender } = req.body;
    const group = await Model.findById(groupId);
    console.log("hi", group);

    // UPDATE RECEIVER - REQUESTS RECEIVED
    const groupMeb = group.members.filter(
      (x) => x.toString() !== sender._id.toString()
    );
    const groupAdm = group.admins.filter(
      (x) => x.toString() !== sender._id.toString()
    );
    await Model.findByIdAndUpdate(groupId, {
      requests: [...groupMeb],
      admins: [...groupAdm],
    });

    res.status(201);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
