const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// Models
const userModel = require("../src/models/user-model");
const accountModel = require("../src/models/account-model");
const transactionModel = require("../src/models/transaction-model");
const ledgerModel = require("../src/models/ledger-model");
const tokenBlacklistModel = require("../src/models/blacklist-model");

// Routes required
const registerRoute = require("../src/routes/registerRoute");
const loginRoute = require("../src/routes/loginRoute");
const accountRoute = require("../src/routes/accountRoute");
const transactionRoute = require("../src/routes/transactionRoute");

// Use routes
app.use("/", registerRoute);
app.use("/", loginRoute);
app.use("/", accountRoute);
app.use("/", transactionRoute);

module.exports = app;
