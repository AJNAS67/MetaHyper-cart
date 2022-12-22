const express = require("express");
const router = express.Router();
const adminController = require("../controler/adminController");
const productController = require("../controler/productController");
const categoryController = require("../controler/categoryController");
const store = require("../middleware/multer");
const couponController = require("../controler/couponController");
const cartContoller = require("../controler/cartContoller");

router.get("/", adminController.admin);
router.get("/adminlog", adminController.adminHome);
// router.get('/adminProducts',adminController.adminProductsView);
router.get("/addproducts", adminController.addProduct);
router.get("/adminProducts", productController.viewProduct);
router.post("/", adminController.adminLogin);

router.get("/viewcategory", adminController.viewCategory);
router.get("/addCategories", productController.addCategory1);

router.get("/viewUser", adminController.viewUser);
router.get("/Home", adminController.Home);

router.get("/product", adminController.product);
router.post(
  "/add-products",
  store.uploadImages,
  store.resizeImages,
  productController.doAddProduct
);
router.post("/add-category", productController.addCategory);
router.post("/deleteproduct/:id", productController.deleteproduct);
router.get(
  "/editproductpage/:Id",
  store.uploadImages,
  store.resizeImages,
  productController.editproductpage
);
router.post("/deleteCategory/:id", productController.doDeleteCategory);

router.post(
  "/updateProduct",
  store.uploadImages,
  store.resizeImages,
  productController.updateProduct
);

router.post("/unblockUser/:id", adminController.unblockUser);
router.post("/blockUser/:id", adminController.blockUser);
router.post("/unblockDress/:id", productController.unblockDress);
router.post("/blockDress/:id", productController.blockDress);
router.get("/oders", productController.viewOrder);
router.post("/order-status", productController.changeTrack);


router.get("/admin_coupon",couponController.adminCoupon);
router.post('/add_coupon',couponController.addCoupon)
router.get('/delete_coupon',couponController.deleteCoupon)

// router.get('/addproducts',productController.addProduct)

module.exports = router;
