const mongoose = require("mongoose");

const userShema = mongoose.Schema(
  {
    username: { type: "String", required: true },
    email: { type: "String", required: true },
    password: { type: "String", required: true },
    age: { type: "Number", required: true },
    role: { type: "String", required: true },
  },
  {
    versionKey: false,
  }
);

const UserModel = mongoose.model("user", userShema);

module.exports = UserModel;
