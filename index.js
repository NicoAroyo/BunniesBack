import env from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

//routes
import { testRouter } from "./src/routes/testRouter.js";
import { authRouter } from "./src/routes/auth/auth.js";

env.config();

//CONNECT TO DB
const mongoString = process.env.DB_URL;

mongoose.connect(mongoString, () => console.log("Connected to MongoDB"));
const db = mongoose.connection;
db.on("error", (error) => {
  console.log(error);
});

const app = express();
const PORT = 3003;

//cMIDDLEWARE
app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server Started at http://localhost:${PORT}/`);
});

app.use("/api/test", testRouter);

app.use("/api/auth", authRouter);
