const mongoose = require("mongoose");

const userSschema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  googleId: {
    type: String,
    required: true,
  },
});

const GoogleUser = mongoose.model("GoogleUser", userSschema);

module.exports = GoogleUser;
