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

router.route("/getAll/:id").get(getAllPosts);
router.route("/get/:id").get(getPost);
router.route("/create").post(createPost);
router.route("/update/:id").put(updatePost);
router.route("/like-dislike/:id").put(like_dislike_Post);
router.route("/delete/:id").delete(deletePost);
router.route("/getUserPosts/:username").get(getUserPosts);

module.exports = router;
