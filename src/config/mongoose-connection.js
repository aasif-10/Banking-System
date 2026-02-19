const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(`${process.env.MONGODB_URI}/bankingsystem`)
  .then(() => {
    console.log("Database connection successful!");
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

module.exports = mongoose.connection;
