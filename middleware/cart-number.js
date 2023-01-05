const cartModel = require("../model/cart");

async function findCartNumber(userId) {
  this.userId = userId;

  const cartView = await cartModel.findOne({ userId });
  let cartNum;
  if (cartView) {
    cartNum = cartView.products.length;
  } else {
    cartNum = 0;
  }
  return cartNum;
}

module.exports = { findCartNumber };
