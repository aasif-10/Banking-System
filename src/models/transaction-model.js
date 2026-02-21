const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema(
  {
    fromAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: [true, "from account is required"],
      index: true,
    },
    toAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: [true, "to account is required"],
      index: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FAILED", "REVERSED"],
      default: "PENDING",
      index: true,
    },
    amount: {
      type: Number,
      min: [0, "min amount is 0"],
      required: [true, "amount is required"],
    },
    idempotencyKey: {
      type: String,
      required: [true, "idem key is required"],
      index: true,
      unique: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("transaction", transactionSchema);
