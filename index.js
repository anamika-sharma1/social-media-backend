const mongoose = require("mongoose");
const BodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const posts = require("./Routes/posts");
const auth = require("./Routes/auth");
const users = require("./Routes/users");
const conversation = require("./Routes/conversation");
const message = require("./Routes/message");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(BodyParser.json({ limit: "30mb", extended: true }));
app.use(BodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/api/posts", posts);
app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/conversation", conversation);
app.use("/api/message", message);

PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.CONNECTION_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
  });
