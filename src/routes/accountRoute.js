const express = require("express");
const router = express.Router();
const { accountController } = require("../controllers/accountController");
const { isLoggedIn } = require("../middlewares/isLoggedIn");

router.post("/accounts", isLoggedIn, accountController);

module.exports = router;
