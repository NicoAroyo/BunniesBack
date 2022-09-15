import env from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
// import bodyParser from "body-parser";
import { testRouter } from "./src/routes/testRouter.js";
import { authRouter } from "./src/routes/auth/authRouter.js";

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
const PORT = 3003;

app.use(express.json());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`Server Started at http://localhost:${PORT}/`);
});

app.use(cors());

app.use("/api/test", testRouter);

app.use("/api/auth", authRouter);
