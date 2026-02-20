const accountModel = require("../models/account-model");

/* 
- Create new account
- Protected route
- POST /acconts
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
