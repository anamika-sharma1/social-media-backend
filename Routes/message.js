const express = require("express");
const router = express.Router();
const { getMessage, createMessage } = require("../controllers/message");

router.route("/").post(createMessage);
router.route("/:id").get(getMessage);

module.exports = router;
