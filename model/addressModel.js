const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  mobNumber: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  appartment: {
    type: String,
      },
  homeaddress: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  zipcode: {
    type: Number,
    required: true,
  },

  userId: {
    type: mongoose.Schema.Types.String,
    ref: "User",
    required: true,
  },
});

const Address = mongoose.model("address", addressSchema);

module.exports = Address;
