const express = require("express");
const {
  transactionController,
} = require("../controllers/transactionController");
const { isLoggedIn } = require("../middlewares/isLoggedIn");
const router = express.Router();

router.post("/transactions", isLoggedIn, transactionController);

module.exports = router;
