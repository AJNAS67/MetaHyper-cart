const flash = require("connect-flash");
const { cartAndWishlstNum } = require("../middleware/cart-wishlist-number");


module.exports = {
  sessionchek: (req, res, next) => {
    if (req.session.userLogin) {
      next();
    } else {
      //   res.redirect('/login');
      res.render("user/womens", { login: false });
    }
  },
  sessionchekDirectLogin: async (req, res, next) => {
    if (req.session.userLogin) {
      next();
    } else {
      const loginError = req.flash("user");
      let userId = req.session.userId;
      const cartAndWishlist = await cartAndWishlstNum(userId);

      res.render("user/userlogin", {
        login: false,
        loginError,
        cartAndWishlist,
      });
    }
  },
};
