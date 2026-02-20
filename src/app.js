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

// Routes required
const registerRoute = require("../src/routes/registerRoute");
const loginRoute = require("../src/routes/loginRoute");
const accountRoute = require("../src/routes/accountRoute");

// Use routes
app.use("/", registerRoute);
app.use("/", loginRoute);
app.use("/", accountRoute);

module.exports = app;
