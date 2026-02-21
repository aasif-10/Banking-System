const mongoose = require("mongoose");

const ledgerSchema = mongoose.Schema(
  {
    account: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      ref: "account",
      required: true,
      immutable: true,
    },
    amount: {
      type: Number,
      required: true,
      immutable: true,
      index: true,
    },
    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "transaction",
      required: true,
      immutable: true,
    },
    type: {
      type: String,
      enum: ["CREDIT", "DEBIT"],
      immutable: true,
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

function preventLedgerModification() {
  throw new Error("Cannot modify ledger");
}

ledgerSchema.pre("findOneAndUpdate", preventLedgerModification);
ledgerSchema.pre("updateOne", preventLedgerModification);
ledgerSchema.pre("deleteOne", preventLedgerModification);
ledgerSchema.pre("deleteMany", preventLedgerModification);

module.exports = mongoose.model("ledger", ledgerSchema);
