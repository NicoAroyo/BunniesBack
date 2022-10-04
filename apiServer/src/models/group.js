import mongoose from "mongoose";
import messag from "./messag";

const groupSchema = new mongoose.Schema({
  name : { 
    required : true, 
    type : String
  },
  creator : {
    required: true, 
    type : String
  }, 
  admins : {
    required : false,
    type : Array,
  },
  posts : {
    required : false, 
    type : Array
  },
  privacy : {
    type: String,
    default : "public"
  },
  date : 
  {
    type: Date,
    default : Date.now
  },
  memebers: 
  {
    required: false,
    type: Array
  },
  messags: 
  {
    required: false,
    type: Array
  }


});

export default mongoose.model("Group", groupSchema);
