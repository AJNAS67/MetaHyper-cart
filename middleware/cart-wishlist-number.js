const cartModel = require("../model/cart");
const wishlistModel = require("../model/wishlistMode");

async function findCartNumber(userId) {
  this.userId = userId;

  const cartView = await cartModel.findOne({ userId });
  let cartNumber;
  if (cartView) {
    cartNumber = cartView.products.length;
  } else {
    cartNumber = 0;
  }
  return cartNumber;
}
async function findWishistNumber(userId) {
  const wishlist = await wishlistModel.findOne({ userId });
  this.userId = userId;

  let wishlistNumber;
  if (wishlist) {
    wishlistNumber = wishlist.myWishlist.length;
  } else {
    wishlistNumber = 0;
  }
  return wishlistNumber;
}

async function cartAndWishlstNum(userId) {
  this.userId = userId;

  const cartNumber = await findCartNumber(userId);

  const wishlistNumber = await findWishistNumber(userId);
  const cartAndWishlistNum = {
    cartNumber: cartNumber,
    wishlistNumber: wishlistNumber,
  };
  return cartAndWishlistNum;
}

module.exports = { cartAndWishlstNum };
