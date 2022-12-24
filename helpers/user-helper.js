const cartModel = require("../model/cart");

var crypto = require("crypto");

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
      await userProducts
        .updateOne({ productId: productId }, { $inc: { $quantity: count } })
        .then(() => resolve(true));
    });
  },
  veryfiyPayment: (detail) => {
    return new Promise((resolve, reject) => {
      var hmac = crypto
        .createHmac("sha256", "nDdPik0bxue6f3gjqtDGIykW")
        .update(
          `${detail.payment.razorpay_order_id +'|'+ detail.payment.razorpay_payment_id}`
        ).digest("hex")
      console.log(hmac, "hmachmac");
      if (hmac == detail.payment.razorpay_signature) {
        resolve();
      } else {
        reject();
      }
    });
  },
};
