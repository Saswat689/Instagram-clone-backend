const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const commentSchema = new mongoose.Schema({
  user: {
    type: ObjectId,
    ref: "User",
  },
});

const postSchema = new mongoose.Schema({
  postImageUrl: {
    type: String,
    default: "",
  },
  createdBy: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
  caption: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0,
  },
  comments: {
    type: [commentSchema],
    default: [],
  },
});

module.exports = mongoose.model("Post", postSchema);
