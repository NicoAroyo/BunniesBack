import express, { json } from "express";
import Model from "../models/user.js";

const usersRouter = express.Router();

//GET ALL http://localhost:5000/api/questions/
usersRouter.get("/", async (req, res) => {
  try {
    const data = await Model.find();
    res.json(data);
  } catch (error) {
    res.send(500).json({ message: error.message });
  }
});

//GET ONE http://localhost:5000/api/questions/{id}
usersRouter.get("/:id", async (req, res) => {
  try {
    const data = await Model.findById(req.params.id);
    res.json(data);
  } catch (error) {
    res.send(500).json({ message: error.message });
  }
});

//PATCH http://localhost:5000/api/questions/{id}
usersRouter.patch("/:id", async (req, res) => {
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

//POST http://localhost:5000/api/questions/
usersRouter.post("/", async (req, res) => {
  const data = new Model({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    loginType: req.body.loginType,
    accessToken: req.body.accessToken,
    email: req.body.email,
    password: req.body.password,
    imageUrl: req.body.imageUrl,
  });

  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//DELETE http://localhost:5000/api/questions/{id}
usersRouter.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Model.findByIdAndDelete(id);
    res.send(`${data} deleted`);
  } catch (error) {
    res.send(400).json({ message: error.message });
  }
});

// usersRouter.get("/bymail/:email", async (req, res) => {
//   try {
//     const email = req.params.email;
//     const data = await Model.find({ email: req.params.email });
//     res.json(data);
//   } catch (error) {
//     res.send(500).json({ message: error.message });
//   }
// });
// export default usersRouter;
