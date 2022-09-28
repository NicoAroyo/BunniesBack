import env from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

//routes
import { authRouter } from "./src/routes/auth/auth.js";
import { postsRouter } from "./src/routes/post.js";
import { usersRouter } from "./src/routes/users.js";
import { relationshipsRouter } from "./src/routes/relationships.js";

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

//MIDDLEWARE
app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server Started at http://localhost:${PORT}/`);
});

app.use("/api/auth", authRouter);

app.use("/api/posts", postsRouter);

app.use("/api/users", usersRouter);

app.use("/api/relationships", relationshipsRouter);
