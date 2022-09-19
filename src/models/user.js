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
  },
  email: {
    required: true,
    type: String,
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
});

export default mongoose.model("User", userSchema);
