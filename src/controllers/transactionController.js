/*
    10 step transfer workflow
    - 1. validate request
    - 2. validate idempotency key

*/

const { default: mongoose } = require("mongoose");
const accountModel = require("../models/account-model");
const transactionModel = require("../models/transaction-model");
const { getBalance } = require("../utils/getBalance");
const ledgerModel = require("../models/ledger-model");
const { sendTransactionCompletedEmail } = require("../services/email");

module.exports.transactionController = async (req, res) => {
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

  // - 1. validate request

  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message: "Params are invalid",
    });
  }

  const fromUserAccount = await accountModel.findOne({ _id: fromAccount });
  const toUserAccount = await accountModel.findOne({ _id: toAccount });

  if (!fromUserAccount || !toUserAccount) {
    res.status(400).json({
      message: "User account invalid or doesnt exist",
    });
  }

  //   - 2. validate idempotency key

  const isTransactionAlreadyExists = await transactionModel.findOne({
    idempotencyKey,
  });

  if (isTransactionAlreadyExists) {
    if (isTransactionAlreadyExists.status == "ACTIVE") {
      res.status(400).json({
        message: "transaction is already active",
      });
    }
    if (isTransactionAlreadyExists.status == "PENDING") {
      res.status(400).json({
        message: "transaction is already pending",
      });
    }
    if (isTransactionAlreadyExists.status == "REVERSED") {
      res.status(400).json({
        message: "transaction is already reversed",
      });
    }
    if (isTransactionAlreadyExists.status == "FAILED") {
      res.status(400).json({
        message: "transaction is already failed",
      });
    }
  }

  //   - 3. check account status
  if (fromUserAccount.status != "ACTIVE" || toUserAccount.status != "ACTIVE") {
    return res.status(400).json({
      message: "account are not active",
    });
  }

  // - 4. validate balance
  const balance = await getBalance(fromAccount);
  if (balance < amount) {
    res.status(400).json({
      message: "balance insufficient",
    });
  }
  // - 5. Creating transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  const transaction = await transactionModel.create(
    {
      fromAccount,
      toAccount,
      amount,
      idempotencyKey,
      status: "PENDING",
    },
    { session },
  );

  const creditLedger = await ledgerModel.create(
    {
      account: toAccount,
      amount: amount,
      transaction: transaction._id,
      type: "CREDIT",
    },
    { session },
  );

  const debitLedger = await ledgerModel.create(
    {
      account: fromAccount,
      amount: amount,
      transaction: transaction._id,
      type: "DEBIT",
    },
    { session },
  );

  transaction.status = "COMPLETED";
  await transaction.save({ session });

  await session.commitTransaction();
  session.endSession();

  // -6. send email notification
  await sendTransactionCompletedEmail(
    req.user.email,
    req.user.name,
    amount,
    toAccount,
  );

  res.status(200).json({
    message: "transaction completed successfully",
    transactionId: transaction._id,
  });
};
