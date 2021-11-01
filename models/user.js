const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const postSchema = new mongoose.Schema({
  post: {
    type: ObjectId,
    ref: "Post",
  },
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    index: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
  userImage: {
    type: String,
    default: "",
  },
  followers: {
    type: [
      {
        username: String,
        userId: {
          type: ObjectId,
          ref: "User",
        },
      },
    ],
    default: [],
  },
  posts: {
    type: [postSchema],
    default: [],
  },
});

module.exports = mongoose.model("User", userSchema);
