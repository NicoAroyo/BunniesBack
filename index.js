import env from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { testRouter } from "./src/routes/testRouter.js";

env.config();
const mongoString = process.env.DB_URL;

mongoose.connect(mongoString);
const db = mongoose.connection;

db.on("error", (error) => {
  console.log(error);
});

db.once("connected", () => {
  console.log("Database Connected");
});

const app = express();
const PORT = 6000;

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server Started at http://localhost:${PORT}/`);
});

app.use(cors());

app.use("/api/test", testRouter);
