const express = require("express");
const router = express.Router();
const {
  accountController,
  getAccountBalanceController,
} = require("../controllers/accountController");
const { isLoggedIn } = require("../middlewares/isLoggedIn");

router.post("/accounts", isLoggedIn, accountController);

router.get(
  "/accounts/balance/:accountId",
  isLoggedIn,
  getAccountBalanceController,
);

module.exports = router;
