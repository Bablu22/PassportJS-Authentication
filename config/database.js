const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tzt34uk.mongodb.net/passport-auth`
  )
  .then(() => {
    console.log("Database connected ");
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = mongoose;
