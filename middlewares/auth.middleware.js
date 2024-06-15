const jwt = require("jsonwebtoken");
const blacklist = require("../blacklist.js");

const auth = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  if (token) {
    if (blacklist.includes(token)) {
      return res.send("You are logged out, Pl login again");
    }
  }

  jwt.verify(token, "masai", (err, decoded) => {
    if (err) {
      res.send("please login first");
    } else {
      req.body = decoded;
      console.log(decoded);
      next();
    }
  });
};

module.exports = auth;
