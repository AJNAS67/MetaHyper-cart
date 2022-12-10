const mongoose = require("mongoose");

// const passportLocalMongoos = require("passport-local-mongoose");

// const Schema = mongoose.Schema;
const UserSchema = new mongoose.Schema({
  user_name: {
    type: String,
    required: true,
  },

  email: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  confirm: {
    required: true,
    type: String,
  },
  address: {
    type:Array
  },

  status: {
    type: String,
    default: "Unblocked",
  },
});


const User = mongoose.model("Userdata", UserSchema);
module.exports = User;
