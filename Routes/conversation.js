const express = require("express");
const router = express.Router();
const {
  createConversation,
  getConversation,
  findConversation,
} = require("../controllers/conversation");

router.route("/").post(createConversation);
router.route("/:userId").get(getConversation);
router.route("/find/:firstUserId/:secondUserId").get(findConversation);

module.exports = router;
