const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "user",
    },
    email: {
      type: String,
      unique: true,
    },
    password: String,
    image: {
      type: String,
      default: null,
    },
    emailVerified: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const User = mongoose.models.users || mongoose.model("users", UserSchema);
module.exports = User;

// const UserSchema = new mongoose.Schema({
//   username: String,
//   email: {
//     type: String,
//     // required: [true, "Please input email"],
//     unique: true,
//   },
//   hash: String,
//   salt: String,
// });

// mongoose.model("User", UserSchema);
