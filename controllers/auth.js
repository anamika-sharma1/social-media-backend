const Users = require("../models/userSchema");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
  let body = req.body;
  //console.log(body);
  if (body.username && body.email && body.password) {
    try {
      const salt = await bcrypt.genSalt(10);
      body.password = await bcrypt.hash(body.password, salt);
      const newUser = new Users(body);
      await newUser.save();
      res.status(201).json({ message: newUser });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  } else {
    res.status(404).json({ message: "All fields are required!" });
  }
};

const loginUser = async (req, res) => {
  const body = req.body;
  if (body.email && body.password) {
    try {
      const user = await Users.findOne({ email: body.email });
      if (user) {
        const validPassword = await bcrypt.compare(
          body.password,
          user.password
        );
        if (!validPassword) {
          res.status(400).json({ message: "Wrong Password" });
        } else {
          const { password, ...other } = user._doc;
          res.status(200).json({ message: other });
        }
      } else {
        res.status(404).json({ message: "Email is not registered" });
      }
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  } else {
    res.status(404).json({ message: "All fields are required!" });
  }
};

module.exports = { registerUser, loginUser };
