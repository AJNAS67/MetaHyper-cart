const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    unique: true,
  },
});
const Category = mongoose.model("Categories", categorySchema);
module.exports = Category;
