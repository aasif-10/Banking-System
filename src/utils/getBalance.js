const ledgerModel = require("../models/ledger-model");

module.exports.getBalance = async (accountId) => {
  const balance = await ledgerModel.aggregate([
    { $match: { account: accountId } },
    {
      $group: {
        _id: null,
        totalDebit: {
          $sum: {
            $cond: [{ $eq: ["$type", "DEBIT"] }, "$amount", 0],
          },
        },
        totalCredit: {
          $sum: {
            $cond: [{ $eq: ["$type", "CREDIT"] }, "$amount", 0],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        balance: { $subtract: ["$totalCredit", "$totalDebit"] },
      },
    },
  ]);
  if (balance.length == 0) {
    return 0;
  }

  return balance[0].balance;
};
