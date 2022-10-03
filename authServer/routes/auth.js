import express from "express";
import env from "dotenv";
import User from "../../apiServer/src/models/user.js";
import { createJWT, verifyAccessToken } from "../JWT/jwtHelper.js";
import { loginValidation, signUpValidation } from "../validation/validation.js";
import bcrypt from "bcryptjs";

env.config();

export const authRouter = express.Router();

// Returns profile by JWT token
authRouter.get("/profile-by-token", verifyAccessToken, async (req, res) => {
  const { userId } = req;
  const user = await User.findById(userId);
  res.status(200).json(user);
});

// Registers a new user
authRouter.post("/register", async (req, res) => {
  try {
    //VALIDATE USER
    const { error } = signUpValidation(req.body);
    if (error) {
      throw new Error(error.message);
    }

    const { email, password, firstName, lastName, imageUrl } = req.body;

    //VALIDATE UNIQUE EMAIL
    const userExists = await User.findOne({ email }).exec();
    if (userExists) {
      throw new Error("Email already taken!");
    }

    //HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //SAVE USER IN DB
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      imageUrl,
    });

    const savedData = await user.save();

    //CREATE A JWT
    const token = createJWT(savedData);

    res.status(200).json({
      ok: true,
      message: "created a new user",
      user: savedData,
      accessToken: token,
    });
  } catch (error) {
    res.status(400).json({ message: error.message, ok: false });
  }
});

authRouter.post("/login", async (req, res) => {
  //VALIDATE CREDENTIALS
  try {
    const { email, password } = req.body;
    const { error } = loginValidation(req.body);
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
    const accessToken = createJWT(user);

    res.status(200).json({ ok: true, user, accessToken });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
});

authRouter.post("/social-login", async (req, res) => {
  try {
    const { email } = req.body;
    let existingUser = await User.findOne({ email });
    // USER NOT FOUND - CREATE NEW
    if (!existingUser) {
      const { firstName, lastName, imageUrl } = req.body;
      const user = new User({ firstName, lastName, imageUrl });
      // SAVE IN DB
      existingUser = await user.save();
    }
    // CREATE ACCESS TOKEN
    const accessToken = createJWT(existingUser);

    res.status(200).json({ ok: true, user: existingUser, accessToken });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
});
