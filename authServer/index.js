import env from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

env.config();

//CONNECT TO DB
const mongoString = process.env.DB_URL;

mongoose.connect(mongoString, () => console.log("AUTH Connected to MongoDB"));
const db = mongoose.connection;
db.on("error", (error) => {
  console.log(error);
});

const app = express();
const PORT = 3002;

//MIDDLEWARE
app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
  console.log(`AUTH Server Started at http://localhost:${PORT}/`);
});

app.post("/register", (req, res) => {
  res.json("register");
});

app.post("/login", (req, res) => {
  res.json("login");
});

app.post("/profile", (req, res) => {
  res.json("profile");
});
