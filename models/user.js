const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "user",
    },
    email: {
      type: String,
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
    role: {
      type: String,
      default: "Employee",
    },
    businessId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

let User = mongoose.models?.users || mongoose.model("users", UserSchema);

module.exports = User;
