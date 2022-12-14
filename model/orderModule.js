const mongoose = require("mongoose");
const Objectid = mongoose.Types.ObjectId;

const oderSchema = new mongoose.Schema(
  {
    userId: {
      type: Objectid,
      ref: "User",
      required: true,
    },
    products: [
      {
        ProductId: {
          type: Objectid,
          ref: "Product",
        },
        quantity: Number,
        name: String,
        price: Number,
        offerPrice: Number,
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    deliveryAddress: {
      type: Object,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      required: true,
    },
    orderStatus: {
      type: String,
      required: true,
    },
    track: {
      type: String,
    },
    returnreason: {
      trpe: String,
    },
    estimatedDate: {
      type: String,
    },
  },

  { timestamps: true }
);

const OrderSchema = mongoose.model("oder", oderSchema);

module.exports = OrderSchema;
