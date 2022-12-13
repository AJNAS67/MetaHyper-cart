const express = require("express");
const router = express.Router();
const userController = require("../controler/userController");
const cartController = require("../controler/cartContoller");
const wishlistControler = require("../controler/wishlistController");
const authMiddleware = require("../auth/auth");
// const { otpVerification, getOtpForm, sendOtp } = require("../middleware/otp");

router.get("/", userController.homeView);

router.get("/home", userController.homeView);
router.get("/shop", userController.shop);
router.get("/signin", userController.userlogin);
router.get("/logout", userController.logout);
router.get("/otp", userController.optPage);
router.get("/signup", userController.userSignup);
router.get("/shopView", userController.shopView);
router.get("/contact", userController.contact);
router.get("/userProfile", userController.profile);
router.get(
  "/wishlist",
  authMiddleware.sessionchekDirectLogin,
  wishlistControler.wishlist
);
router.get("/removeWishlist/:wishId", wishlistControler.removeWishlist);
router.get(
  "/product-details",
  authMiddleware.sessionchekDirectLogin,
  userController.productDetails
);
router.get(
  "/shoping-cart",
  authMiddleware.sessionchekDirectLogin,
  cartController.shopingCart
);
router.get("/removeCart/:cartId", cartController.removeCart);
router.get(
  "/checkout",
  authMiddleware.sessionchekDirectLogin,
  userController.checkout
);
router.get("/mens", authMiddleware.sessionchek, userController.mens);
router.get("/womens", userController.womens);
router.get("/register", userController.doRegister);

// router.get('/otp',userController.otpget)

router.post("/addtocart", cartController.ajnas);
router.post("/otp", userController.otp);
router.post("/login", userController.login);

router.post("/verifyotp", userController.otpVerifi);
// router.post("/verifyotp", otpVerification);

router.post("/resendotp", userController.resentOpt);

// router.post("/login", userController.doLogin);
router.post("/signin", userController.signUp);
router.post("/addtocart/:prodId", cartController.addTocart);
router.post("/addtoWishlist/:prodId", wishlistControler.addtoWishlist);
router.get("/product-details/:Id", userController.prodDetail);
router.get('/addAddress',userController.addAddress)
router.post('/addAddress',userController.doAddaddress)
router.get('/quantityDec/:proid',cartController.QuantityDec)

router.get('/quantityInc/:proid',cartController.QuantityInc)
router.post('/change-product-quantity',cartController.changeProductQuantity)
module.exports = router;
