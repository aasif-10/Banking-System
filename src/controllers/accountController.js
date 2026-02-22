const accountModel = require("../models/account-model");
const { getBalance } = require("../utils/getBalance");

/* 
- Create new account
- Protected route
- POST /accounts
*/

module.exports.accountController = async (req, res) => {
  const user = req.user;
  const account = await accountModel.create({
    user: user._id,
  });

  res.status(201).json({
    message: "Account created sucessfully",
    status: "passed",
  });
};

/*
- Get account balance
- Protected route
- GET /accounts/balance/:accountId
*/

module.exports.getAccountBalanceController = async (req, res) => {
  const accountId = req.params.accountId;
  const account = await accountModel.findOne({
    _id: accountId,
    user: req.user._id,
  });

  if (!account) {
    return res.status(401).json({
      message: "account invalid",
    });
  }
  res.status(200).json({
    account: account,
    balance: await getBalance(account._id),
  });
};
