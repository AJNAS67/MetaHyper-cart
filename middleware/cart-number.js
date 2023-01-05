const cartModel = require("../model/cart");

async function findCartNumber(userId) {
  this.userId = userId;

  const cartView = await cartModel.findOne({ userId });
  let cartNum;
  if (cartView) {
    console.log(cartView, "cartModelcartModel");

    cartNum = cartView.products.length;
    console.log(
      cartNum,
      "cartViewcartViewcartViewcartViewcartViewcartViewcartView"
    );
  } else {
    cartNum = 0;
  }
  return cartNum;
}

module.exports = { findCartNumber };
