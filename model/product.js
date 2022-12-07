const mongoose = require("mongoose");
const Objectid = mongoose.Types.ObjectId;

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },

  isFeatured: {
    type: Boolean,
    default: false,
  },
  Image: {
    type: Array,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: Number,
  offerPrice: Number,
  description: {
    type: String,
    required: true,
  },
  brand: String,
  rating: {
    type: [Number],
  },
  avgRating: {
    type: Number,
    required: true,
    default: 0,
  },
  totalReviews: {
    type: Number,
    required: true,
    default: 0,
  },
  category: {
    type: Objectid,
    required: true,
    ref: "Categories",
  },
  status: {
    type: String,
    default: "Unblocked",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
