const mongoose = require("mongoose");

const accountSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      require: [true, "User is required"],
      index: true, // A account has many users - so using optimised query search technique using indexing.
    },

    status: {
      type: String,
      enum: ["ACTIVE", "FROZEN", "CLOSED"],
      required: [true, "Status is required"],
      default: "ACTIVE",
    },

    currency: {
      type: String,
      default: "INR",
      required: [true, "Currency is required"],
    },
  },

  { timestamps: true },
);

accountSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model("account", accountSchema);
