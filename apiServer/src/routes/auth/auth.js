import express from "express";
import User from "../../models/user.js";
import jwt from "jsonwebtoken";
import env from "dotenv";
import bcrypt from "bcryptjs";
import {
  signUpValidation,
  loginUpValidation,
} from "../../validation/validation.js";

env.config();

export const authRouter = express.Router();

authRouter.post("/sign-up", async (req, res) => {
  //VALIDATE USER
  try {
    const { error } = signUpValidation(req.body);
    if (error) {
      throw new Error(error.message);
    }
    //VALIDATE UNIQUE EMAIL
    const userExists = await User.findOne({ email: req.body.email }).exec();
    if (userExists) {
      throw new Error("Email already taken!");
    }

    //HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
      imageUrl: req.body.imageUrl,
    });

    const dataToSave = await user.save();
    res
      .status(200)
      .json({ ok: true, message: "created a new user", user: dataToSave });
  } catch (error) {
    res.status(400).json({ message: error.message, ok: false });
  }
});

authRouter.post("/login", async (req, res) => {
  //VALIDATE CREDENTIALS
  try {
    const { email, password } = req.body;
    const { error } = loginUpValidation(req.body);
    if (error) {
      throw new Error(error.message);
    }
    //VALIDATE EMAIL
    const user = await User.findOne({ email }).exec();
    if (!user) {
      throw new Error("Wrong Email");
    }
    //VALIDATE PASSWORD
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      throw new Error("Wrong Password");
    }
    //CREATE ACCESS TOKEN
    const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET);
    res.header("auth-token", token);

    res.status(200).json({ ok: true, user, accessToken: token });
  } catch (error) {
    res.status(400).json({ message: error.message, ok: false });
  }
});
