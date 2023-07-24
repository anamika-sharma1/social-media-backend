const Users = require("../models/userSchema");
const bcrypt = require("bcrypt");

const updateUser = async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    }
    try {
      const updatedUser = await Users.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      return res.status(200).json({ message: "Account updated successfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    return res
      .status(403)
      .json({ message: "You cannot update another user's profile." });
  }
};

const deleteUser = async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const deletedUser = await Users.findByIdAndDelete(req.params.id);
      return res.status(200).json({ message: deleteUser });
    } catch (error) {
      return res.status(500).json({ message: "Deleted Successfully" });
    }
  } else {
    return res.status(403).json({ message: "You cannot delete another user" });
  }
};

const getUser = async (req, res) => {
  const username = req.query.username;
  const userId = req.query.userId;
  try {
    const user = username
      ? await Users.findOne({ username })
      : await Users.findById(userId);
    if (user) {
      const { password, updatedAt, ...other } = user._doc;
      return res.status(200).json({ message: other });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getFollowers = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await Users.findById(userId);
    const friends = await Promise.all(
      user.followers.map((friendId) => {
        return Users.findById(friendId);
      })
    );
    const friendList = [];
    friends.map((friend) => {
      const { _id, profilePicture, username } = friend;
      friendList.push({ _id, profilePicture, username });
    });
    res.status(200).json({ message: friendList });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const followUser = async (req, res) => {
  if (req.body.userId && req.params.id) {
    try {
      const currentUserId = await Users.findById(req.body.userId);
      const user = await Users.findById(req.params.id);
      if (currentUserId && user) {
        if (user.followers.includes(req.body.userId)) {
          // console.log("You already follow this user");
          res.status(200).json({ message: "You already follow this user" });
        } else {
          await user.updateOne({ $push: { followers: req.body.userId } });
          await currentUserId.updateOne({
            $push: { following: req.params.id },
          });
          // const resUser = await Users.findById(req.params.id);
          // const resCurrentUser = await Users.findById(req.body.userId);
          res.status(200).json({ messgae: "User Followed Successfully" });
        }
      } else {
        res.status(404).json({ message: "Invalid User" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(400).json({ message: "PLease specify user to follow" });
  }
};

const unfollowUser = async (req, res) => {
  console.log("i am unfollow");
  if (req.body.userId && req.params.id) {
    try {
      const currentUserId = await Users.findById(req.body.userId);
      const user = await Users.findById(req.params.id);
      if (currentUserId && user) {
        if (!user.followers.includes(req.body.userId)) {
          res.status(200).json({ message: "You don't follow this user" });
        } else {
          await user.updateOne({ $pull: { followers: req.body.userId } });
          await currentUserId.updateOne({
            $pull: { following: req.params.id },
          });
          // const resUser = await Users.findById(req.params.id);
          // const resCurrentUser = await Users.findById(req.body.userId);
          res.status(200).json({ message: "User Unfollowed Successfully" });
        }
      } else {
        res.status(404).json({ message: "Invalid User" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(400).json({ message: "PLease specify user to unfollow" });
  }
};

const getFriends = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await Users.findById(userId);
    const friends = await Promise.all(
      user.following.map((friendId) => {
        return Users.findById(friendId);
      })
    );
    const friendList = [];
    friends.map((friend) => {
      const { _id, profilePicture, username } = friend;
      friendList.push({ _id, profilePicture, username });
    });
    res.status(200).json({ message: friendList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  updateUser,
  deleteUser,
  getUser,
  followUser,
  unfollowUser,
  getFriends,
  getFollowers,
};
