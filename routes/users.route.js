const express = require("express");
const UserModel = require("../models/user.model");
const userRoute = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const blacklist = require("../blacklist.js");

userRoute.post("/register", async (req, res) => {
  const { username, email, password, age, role } = req.body;
  try {
    bcrypt.hash(password, 3, async (err, hash) => {
      if (err) {
        res.send("There is error in hashing", err);
      } else {
        const user = new UserModel({
          username,
          email,
          password: hash,
          age,
          role,
        });
        await user.save();
        res.status(200).send("Registration successful");
      }
    });
  } catch (error) {
    console.log("There is error in registration", error);
  }
});

userRoute.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        res.send("error in hashing password");
      }
      if (result) {
        const accessToken = jwt.sign(
          { email: user.email, username: user.username, role: user.role },
          "masai",
          { expiresIn: "15s" }
        );
        const refreshToken = jwt.sign(
          { email: user.email, username: user.username, role: user.role },
          "masaischool",
          { expiresIn: "1d" }
        );
        res.send({
          msg: "Login successful",
          accessToken: accessToken,
          refreshToken: refreshToken,
        });
      } else {
        res.send("Password is incorret");
      }
    });
  } catch (error) {
    res.status(404).send("error in email");
  }
});

userRoute.get("/logout", (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  blacklist.push(token);
  res.send({ msg: "Loggedout successfully" });
});

module.exports = userRoute;
