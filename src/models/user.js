import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    required: true,
    type: String,
  },
  lastName: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
    min: 6,
    max: 1024,
  },
  email: {
    required: true,
    type: String,
    min: 6,
    max: 1024,
  },
  isAdmin: {
    required: true,
    type: Boolean,
    default: false,
  },
  imageUrl: {
    required: false,
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("User", userSchema);
