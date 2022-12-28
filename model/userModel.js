const mongoose = require("mongoose");

// const passportLocalMongoos = require("passport-local-mongoose");

// const Schema = mongoose.Schema;

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
});

const UserSchema = new mongoose.Schema(
  {
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
      type: Array,
    },

    status: {
      type: String,
      default: "Unblocked",
    },
    address: {
      type: [addressSchema],
    },
    coupon: {
      type: Array,
    },
    applyCoupon: {
      type: Boolean,
      default: false,
    },
    usedCoupon: {
      type: Array,
    },
    useWallet:{
      type:Number,
    },  
  },
  { timestamps: true }
);

const User = mongoose.model("Userdata", UserSchema);
module.exports = User;
