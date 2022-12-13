const cartModel = require("../model/cart");

module.exports = {
  changeProductQuantity: async (productDetails, user) => {
    const productId = productDetails.product;
    const count = parseInt(productDetails.count);
    console.log(productId, "productId");
    console.log(count, "count");

    console.log(user, "user");
    console.log(productDetails.count, "count");
    const userProducts = await cartModel.findOne({ userId: user });
    console.log(userProducts, "cart");

    return new Promise(async (resolve, reject) => {
      await userProducts.updateOne(
        { productId: productId },
        { $inc: { $quantity: count } }
      ).then(() => resolve(true));
    })
  },
};
