const express = require("express");
const router = express.Router();
const {
  updateUser,
  deleteUser,
  getUser,
  followUser,
  unfollowUser,
  getFriends,
  getFollowers,
} = require("../controllers/users");
const validateFunction = require("../validate");

router.route("/update").put(validateFunction, updateUser);
router.route("/delete").delete(validateFunction, deleteUser);
router.route("/get").get(getUser);
router.route("/follow/:id").put(followUser);
router.route("/unfollow/:id").put(unfollowUser);
router.route("/getFriends/:id").get(getFriends);
router.route("/getFollowers/:id").get(getFollowers);

module.exports = router;
