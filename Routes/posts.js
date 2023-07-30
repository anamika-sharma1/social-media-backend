const express = require("express");
const router = express.Router();
const {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getUserPosts,
  like_dislike_Post,
} = require("../controllers/posts");
const validateFunction = require("../validate");

router.route("/getAll/:id").get(getAllPosts);
router.route("/get/:id").get(getPost);
router.route("/create").post(validateFunction, createPost);
router.route("/update/:id").put(validateFunction, updatePost);
router.route("/like-dislike/:id").put(validateFunction, like_dislike_Post);
router.route("/delete/:id").delete(validateFunction, deletePost);
router.route("/getUserPosts/:username").get(getUserPosts);

module.exports = router;
