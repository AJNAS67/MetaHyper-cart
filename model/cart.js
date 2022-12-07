const mongoose = require("mongoose");
const Objectid = mongoose.Types.ObjectId;

const cartSchema = new mongoose.Schema({
  userId: {
    type: Objectid,
    ref: "User",
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
  subTotal: {
    type: String,
  },
  total: {
    type: Number,
    default: 0,
    require: true,
  },
});
module.exports = mongoose.model("Cart", cartSchema);
