const cartModel = require("../model/cart");
const productModel = require("../model/product");
const wishlistModel = require("../model/wishlistMode");

module.exports = {
  wishlist: async (req, res) => {
    const user = req.session.user;

    try {
      let userId = req.session.userId;
      const wishView = await wishlistModel
        .findOne({ userId })
        .populate("myWishlist.ProductId")
        .exec();
      if (wishView) {
        req.session.wishNum = wishView.myWishlist.length;
      }
      wishNum = req.session.wishNum;
      console.log(wishView, "wishView");

      cartNum = req.session.cartNum;
      res.render("user/wishlist", {
        login: true,
        user,
        wishNum,
        wishProducts: wishView,
      });
    } catch (error) {
      console.log(error.message);
    }
  },
  addtoWishlist: async (req, res) => {
    try {
      let userId = req.session.userId;
      console.log(req.body);
      let name = req.body.name;
      let ProductId = req.params.prodId;
      console.log(ProductId);
      let list = await wishlistModel.findOne({ userId: userId });
      console.log(list, "list");
      if (list) {
        let itemIndex = list.myWishlist.findIndex(
          (p) => p.ProductId == ProductId
        );
        console.log(itemIndex, "itemIndex");
        if (itemIndex > -1) {
          console.log('hi');
          // list.myWishlist.splice(itemIndex, 1);
        } else {
          list.myWishlist.push({ ProductId, name });
        }
        await list.save();
      } else {
        list = new wishlistModel({
          userId: userId,
          myWishlist: [{ ProductId, name }],
        });
        console.log(list, "list");
        await list.save();
        res.redirect("/");

        console.log("wishlist first added");
      }
    } catch (error) {
      console.log(error.message, "error from wishlist");
    }
  },
  removeWishlist: async (req, res) => {
    let userWishlist = await wishlistModel.findOne({
      userId: req.session.userId,
    });
    let wishlistIndex = userWishlist.myWishlist.findIndex(
      (prod) => (prod._id = req.params.wishId)
    );
    if (wishlistIndex != null) {
      userWishlist.myWishlist.splice(wishlistIndex, 1);
      await userWishlist.save();
      res.redirect("/wishlist");
    } else {
      res.redirect("/");
    }
  },
};
