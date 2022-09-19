import express from "express";
import Model from "../../models/user.js";

export const authRouter = express.Router();

authRouter.post("/sign-up", async (req, res) => {
  const dataReq = req.body;
  const data = new Model({
    imageUrl: dataReq.imageUrl,
    email: dataReq.email,
    firstName: dataReq.firstName,
    lastName: dataReq.lastName,
    password: dataReq.password,
  });

  try {
    const user = await Model.findOne({ email: data.email }).exec();
    //user doesnt exist
    if (!user) {
      const dataToSave = await data.save();
      res.status(200).json({
        ok: true,
        type: "new",
        message: "created a new user",
        user: dataToSave,
      });
      //user exists
    } else {
      throw new Error("Email already taken!");
    }
  } catch (error) {
    res.status(400).json({ message: error.message, ok: false });
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Model.findOne({
      email,
      password,
    }).exec();
    if (user) {
      res.status(200).json({ ok: true, user });
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(400).json({ message: error.message, ok: false });
  }
});
