const mongoose = require("mongoose");

const postsSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      max: 50,
    },
    desc: {
      type: String,
      max: 100,
    },
    img: {
      type: String,
    },
    likes: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Posts = mongoose.model("Posts", postsSchema);
module.exports = Posts;
