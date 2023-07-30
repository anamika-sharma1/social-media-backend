const Posts = require("../models/postSchema");
const Users = require("../models/userSchema");

const getAllPosts = async (req, res) => {
  const userId = req.params.id;
  let userPosts = [];
  try {
    const user = await Users.findById(userId);
    userPosts = await Posts.find({ userId });
    const friendPosts = await Promise.all(
      user.following.map((friendId) => {
        return Posts.find({ userId: friendId });
      })
    );
    userPosts = userPosts.concat(...friendPosts);
    // userPosts.sort((a, b) => b.createdAt - a.createdAt);
    res.status(200).json({ message: userPosts });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getUserPosts = async (req, res) => {
  const username = req.params.username;
  try {
    const user = await Users.findOne({ username });
    const userPosts = await Posts.find({ userId: user._id });
    // userPosts.sort((a, b) => b.createdAt - a.createdAt);
    res.status(200).json({ message: userPosts });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getPost = async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await Posts.findById(postId);
    if (post) {
      return res.status(200).json({ message: post });
    } else {
      return res.status(404).json({ message: "Post is not found!" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createPost = async (req, res) => {
  // console.log("in");
  const body = req.body;
  try {
    if (req.body.userId === req.user.userId) {
      const post = new Posts(body);
      await post.save();
      return res.status(200).json({ message: post });
    } else {
      return res.status(401).json("You cannot create this post");
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deletePost = async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await Posts.findById(postId);
    if (post.userId === req.user.userId) {
      await post.deleteOne();
      return res.status(200).json({ message: "Deleted Successfully" });
    } else {
      return res.status(403).json({ message: "You cannot delete this post!" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updatePost = async (req, res) => {
  // console.log("in");
  const postId = req.params.id;
  const body = req.body;
  try {
    const post = await Posts.findById(postId);
    if (post.userId === req.user.userId) {
      await post.updateOne({ $set: body });
      return res.status(200).json({ message: "Updated Successfully" });
    } else {
      return res.status(403).json({ message: "You cannot update this post!" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const like_dislike_Post = async (req, res) => {
  // console.log("in");
  const postId = req.params.id;
  const userId = req.body.userId;
  try {
    if (userId === req.user.userId) {
      const post = await Posts.findById(postId);
      if (post) {
        if (post.likes.includes(userId)) {
          await post.updateOne({ $pull: { likes: userId } });
          return res.status(200).json({ message: "Post Disliked" });
        } else {
          await post.updateOne({ $push: { likes: userId } });
          return res.status(200).json({ message: "Post Liked" });
        }
      } else {
        return res.status(404).json({ message: "Post is not found" });
      }
    } else {
      return res
        .status(403)
        .json({ message: "You cannot like/dislike this post!" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllPosts,
  getPost,
  createPost,
  deletePost,
  updatePost,
  getUserPosts,
  like_dislike_Post,
};
