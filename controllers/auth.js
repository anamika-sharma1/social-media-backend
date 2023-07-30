const Users = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
          const accessToken = jwt.sign(
            {
              user: {
                username: user.username,
                email: user.email,
                userId: user._id,
                isAdmin: user.isAdmin,
              },
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
              expiresIn: "12h",
            }
          );
          const { password, ...other } = user._doc;
          let response = {
            user: other,
            token: accessToken,
          };
          res.status(200).json({ message: response });
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
