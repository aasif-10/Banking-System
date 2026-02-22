/*
    10 step transfer workflow
    - 1. validate request
    - 2. validate idempotency key
    - 3. check account status
    - 4. validate balance
    - 5. Creating transaction
    - 6. send email notification

*/

const { default: mongoose } = require("mongoose");
const accountModel = require("../models/account-model");
const transactionModel = require("../models/transaction-model");
const { getBalance } = require("../utils/getBalance");
const ledgerModel = require("../models/ledger-model");
const { sendTransactionCompletedEmail } = require("../services/email");

/*
- POST /transactions
- Create new transaction
*/

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
    return res.status(400).json({
      message: "User account invalid or doesnt exist",
    });
  }

  //   - 2. validate idempotency key

  const isTransactionAlreadyExists = await transactionModel.findOne({
    idempotencyKey,
  });

  if (isTransactionAlreadyExists) {
    if (isTransactionAlreadyExists.status == "ACTIVE") {
      return res.status(400).json({
        message: "transaction is already active",
      });
    }
    if (isTransactionAlreadyExists.status == "PENDING") {
      return res.status(400).json({
        message: "transaction is already pending",
      });
    }
    if (isTransactionAlreadyExists.status == "REVERSED") {
      return res.status(400).json({
        message: "transaction is already reversed",
      });
    }
    if (isTransactionAlreadyExists.status == "FAILED") {
      return res.status(400).json({
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
    return res.status(400).json({
      message: "balance insufficient",
    });
  }
  // - 5. Creating transaction
  const session = await mongoose.startSession();
  await session.startTransaction();

  const transaction = (
    await transactionModel.create(
      [
        {
          fromAccount,
          toAccount,
          amount,
          idempotencyKey,
          status: "PENDING",
        },
      ],
      { session },
    )
  )[0];

  const creditLedger = await ledgerModel.create(
    [
      {
        account: toAccount,
        amount: amount,
        transaction: transaction._id,
        type: "CREDIT",
      },
    ],
    { session },
  );

  const debitLedger = await ledgerModel.create(
    [
      {
        account: fromAccount,
        amount: amount,
        transaction: transaction._id,
        type: "DEBIT",
      },
    ],
    { session },
  );

  await transactionModel.findOneAndUpdate(
    { _id: transaction._id },
    { status: "COMPLETED" },
    { session },
  );

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

/*
- POST /transactions/system/intial-fund
- Credit initila fund
*/

module.exports.createInitialFunds = async (req, res) => {
  const { toAccount, amount, idempotencyKey } = req.body;

  if (!toAccount || !amount || !idempotencyKey)
    return res.status(401).json({
      message: "invalid params",
    });

  const toUserAccount = await accountModel.findOne({ _id: toAccount });

  if (!toUserAccount)
    return res.status(401).json({
      message: "to account not found",
    });

  const fromUserAccount = await accountModel.findOne({
    user: req.user._id,
  });

  if (!fromUserAccount)
    return res.status(401).json({
      message: "system account doesn't exist",
    });

  let transaction;
  const session = await mongoose.startSession();
  session.startTransaction();

  transaction = await transactionModel.create(
    {
      fromAccount: fromUserAccount._id,
      toAccount,
      amount,
      idempotencyKey,
      status: "PENDING",
    },
    { session },
  )[0];

  const debitLedgerEntry = await ledgerModel.create(
    [
      {
        account: fromUserAccount._id,
        amount,
        transaction: transaction._id,
        type: "DEBIT",
      },
    ],
    { session },
  );

  const creditLedgerEntry = await ledgerModel.create(
    [
      {
        account: toAccount,
        amount,
        transaction: transaction._id,
        type: "CREDIT",
      },
    ],
    { session },
  );

  await transactionModel.findOneAndUpdate(
    { _id: transaction._id },
    { status: "COMPLETED" },
    { session },
  );

  await session.commitTransaction();
  session.endSession();

  res.status(201).json({
    transaction: transaction,
  });
};
