const jwt = require("jsonwebtoken");

const validateFunction = async (req, res, next) => {
  // console.log("innnnn");
  // console.log("i ammmmm");
  let token;
  const givenToken = req.headers.Authorization || req.headers.authorization;
  if (givenToken && givenToken.startsWith("Bearer")) {
    token = givenToken.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json("User is not authorized");
      }
      req.user = decoded.user;
      // console.log(req.user);
      next();
    });
    if (!token) {
      return res.status(401).json("User is not authorized");
    }
  }
};

module.exports = validateFunction;
