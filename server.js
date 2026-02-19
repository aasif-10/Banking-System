const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");

const app = require("./src/app");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

const mongooseConnection = require("./src/config/mongoose-connection");

const userModel = require("./src/models/user-model");

const registerRoute = require("./src/routes/registerRoute");
const loginRoute = require("./src/routes/loginRoute");

app.use("/", registerRoute);
app.use("/", loginRoute);

app.listen(3000, () => {
  console.log("Server is running at port 3000!");
});
