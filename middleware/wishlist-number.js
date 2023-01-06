let wishlistModel = require("../model/wishlistModel");

async function findWishistNumber() {
  const wishlist = await wishlistModel.findOne({userId});

  this.userId = userId;
  let wishlistNum;
  if (wishlist) {
    console.log(wishlist, "cartModelcartModel");

    wishlistNum = wishlist.length;
    console.log(
      wishlistNum,
      "wishlistcartViewcartViewcartViewcartViewcartViewcartView"
    );
  } else {
    wishlistNum = 0;
  }
  return wishlistNum;
}
module.exports = { findWishistNumber };
