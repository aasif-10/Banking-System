const mongoose = require("mongoose");

const userModel = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: [true, "Email must be unique"],
    },
    name: {
      type: String,
      require: [true, "Name is required"],
    },
    password: {
      type: String,
      reuqired: [true, "Password is required"],
    },
    systemUser: {
      type: Boolean,
      default: false,
      immutable: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("user", userModel);
