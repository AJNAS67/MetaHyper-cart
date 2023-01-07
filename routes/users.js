const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const cartController = require("../controller/cartContoller");
const wishlistcontroller = require("../controller/wishlistController");
const authMiddleware = require("../auth/auth");
const orderController = require("../controller/orderController");
const couponController = require("../controller/couponController");
// const { otpVerification, getOtpForm, sendOtp } = require("../middleware/otp");

router.get("/", userController.homeView);

router.get("/home", userController.homeView);
router.get("/signin", userController.userlogin);
router.get("/logout", userController.logout);
router.get("/otp", userController.optPage);
router.get("/signup", userController.userSignup);
router.get("/shopView", userController.shopView);
router.get("/contact", userController.contact);
router.get(
  "/userProfile",
  authMiddleware.sessionchekDirectLogin,
  userController.profile
);
router.get(
  "/wishlist",
  authMiddleware.sessionchekDirectLogin,
  wishlistcontroller.wishlist
);
router.get(
  "/removeWishlist/:wishId",
  authMiddleware.sessionchekDirectLogin,
  wishlistcontroller.removeWishlist
);
router.get("/product-details", userController.productDetails);
router.get(
  "/shoping-cart",
  authMiddleware.sessionchekDirectLogin,
  cartController.shopingCart
);

router.get("/forgetPassword", userController.forgetPassword);

router.get("/removeCart/:cartId", cartController.removeCart);
router.get(
  "/checkout",
  authMiddleware.sessionchekDirectLogin,
  userController.checkout
);
router.get("/mens", userController.mens);
router.get("/womens", userController.womens);
router.get("/kids", userController.kids);

router.get("/cosmetics", userController.cosmetics);
router.get("/accessories", userController.Accessories);

router.get("/register", userController.doRegister);

// router.get('/otp',userController.otpget)

router.post("/otp", userController.otp);
router.post("/forgoet-password-otp", userController.otpForForget);
// router.post('/resetPassword',userController.resetPassword )
router
  .route("/resetPassword")
  .post(userController.resetPassword)
  .get(userController.getResetPassword);

router.post("/login", userController.login);

router.post("/verifyotp", userController.otpVerifi);
// router.post("/verifyotp", otpVerification);

router.post("/resendotp", userController.resentOpt);

// router.post("/login", userController.doLogin);
router.post("/signin", userController.signUp);
router.post("/addtocart/:prodId", cartController.addTocart);
router.post(
  "/addtoWishlist/:prodId",
  authMiddleware.sessionchekDirectLogin,
  wishlistcontroller.addtoWishlist
);
router.get("/product-details/:Id", userController.prodDetail);
router.get(
  "/addAddress",
  authMiddleware.sessionchekDirectLogin,
  userController.addAddress
);
router.post(
  "/addAddress",
  authMiddleware.sessionchekDirectLogin,
  userController.doAddaddress
);
router.get("/quantityDec/:proid", cartController.QuantityDec);

router.get(
  "/quantityInc/:proid",
  authMiddleware.sessionchekDirectLogin,
  cartController.QuantityInc
);
router.post("/change-product-quantity", cartController.changeProductQuantity);
router.get(
  "/viewOrders",
  authMiddleware.sessionchekDirectLogin,
  orderController.viewOrders
);
router.post(
  "/checkout/:CartId",
  authMiddleware.sessionchekDirectLogin,
  orderController.postCheckOut
);
router.get(
  "/orderSummary",
  authMiddleware.sessionchekDirectLogin,
  orderController.postOderSuccess
);
router.get(
  "/ordertracking",
  authMiddleware.sessionchekDirectLogin,
  orderController.getTracking
);
router.post(
  "/verifyPayment",
  authMiddleware.sessionchekDirectLogin,
  orderController.doVerifyPayment
);
router.post(
  "/paymentFailed",
  authMiddleware.sessionchekDirectLogin,
  orderController.postPaymentFailed
);
router.post(
  "/editAddress/:id",
  authMiddleware.sessionchekDirectLogin,
  userController.editprofile
);
router.get(
  "/deleteAddress/:index",
  authMiddleware.sessionchekDirectLogin,
  userController.deleteAdress
);
// coupen

router.post(
  "/coupon_verify",
  authMiddleware.sessionchekDirectLogin,
  couponController.couponVerify
);

router.get(
  "/cancelOrder",
  authMiddleware.sessionchekDirectLogin,
  orderController.getCancelOrder
);
// price filter

router.get("/shop/category", userController.getShopByCategory);
router.get("/shop/categoryMen", userController.getMenPriceFilter);
router.get("/shop/categoryKid", userController.getKidsPriceFilter);
router.get("/shop/categoryCosmetics", userController.getCosmeticsFilter);
router.get("/shop/categoryAccessories", userController.getAccessoriesFilter);
router.post(
  "/returnOrder",
  authMiddleware.sessionchekDirectLogin,
  orderController.returnOrder
);
router.get(
  "/myCoupon",
  authMiddleware.sessionchekDirectLogin,
  couponController.myCoupons
);
router
  .route("/reset-password-otp")
  .get(userController.resetOtpPage)
  .post(userController.resetForgetOtp);
// router.post('/verify-reset-password-otp',userController.verifyResetOtp)
router
  .route("/verify-reset-password-otp")
  .get(userController.resetPasswordPage)
  .post(userController.verifyResetOtp);
router.get("/404", userController.error);

module.exports = router;
