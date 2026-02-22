const express = require("express");
const {
  transactionController,
  createInitialFunds,
} = require("../controllers/transactionController");
const { isLoggedIn } = require("../middlewares/isLoggedIn");
const { isSystemLoggedIn } = require("../middlewares/isSystemLoggedIn");
const router = express.Router();

router.post("/transactions", isLoggedIn, transactionController);

router.post(
  "/transactions/system/initial-fund",
  isSystemLoggedIn,
  createInitialFunds,
);

module.exports = router;
