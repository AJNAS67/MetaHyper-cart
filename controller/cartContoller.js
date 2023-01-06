const cartModel = require("../model/cartModel");
const productModel = require("../model/productModel");
const { login } = require("./userController");
const express = require("express");
const userHelpers = require("../helpers/user-helper");
const User = require("../model/userModel");
const { cartAndWishlstNum } = require("../middleware/cart-wishlist-number");

const app = express();

module.exports = {
  addTocart: async (req, res) => {
    try {
      let user = req.session.user;
      let quantity = 1;
      let name = req.body.name;
      let price = req.body.price;
      const ProductId = req.params.prodId;
      const findProduct = await productModel.findById(ProductId);
      const userId = req.session.userId;
      let cart = await cartModel.findOne({ userId });
      let userdetails = await User.findById(userId);

      if (user) {
        if (userdetails.applyCoupon == false) {
          if (cart) {
            let itemIndex = cart.products.findIndex(
              (p) => p.ProductId == ProductId
            );
            if (itemIndex > -1) {
              let productItem = cart.products[itemIndex];
              productItem.quantity += quantity;
              res.json({ exist: true });
            } else {
              cart.products.push({ ProductId, quantity, name, price });
              res.json({ cart: true });
            }
            cart.total = cart.products.reduce((acc, curr) => {
              return acc + curr.quantity * curr.price;
            }, 0);
            cart.subTotal = cart.products.reduce((acc, curr) => {
              return acc + curr.quantity * curr.price;
            }, 0);
            await cart.save();
            // res.json({ cart: true });
            // res.json({ exist: true });

            // res.redirect("/shoping-cart");
          } else {
            const total = quantity * price;
            const subTotal = quantity * price;
            cart = new cartModel({
              userId: userId,
              products: [{ ProductId, quantity, name, price }],
              total: total,
              subTotal: subTotal,
            });
            await cart.save();
            // res.redirect("/shoping-cart");
            res.json({ cart: true });
          }
        } else {
          res.json({ applyCoupon: true });
        }
      } else {
        res.json({ login: true });
      }
    } catch (error) {
      console.log(error.message, "erro");
      app.use((req, res) => {
        res.status(429).render("admin/error-429");
      });
    }
  },

  shopingCart: async (req, res) => {
    const user = req.session.user;
    let userId = req.session.userId;

    const cartAndWishlist = await cartAndWishlstNum(userId);

    try {
      const userDetails = await User.findById(userId);
      console.log(userDetails.applyCoupon);
      let applyCoupon = userDetails.applyCoupon;
      const cartView = await cartModel
        .findOne({ userId })
        .populate("products.ProductId")
        .exec();

      if (cartView) {
        req.session.cartNum = cartView.products.length;
      }
      let cartNum = req.session.cartNum;

      if (applyCoupon) {
        let usedCouponlen = userDetails.usedCoupon.length - 1;
        const usedCoupon = userDetails.usedCoupon[usedCouponlen];
        res.render("user/shoping-cart", {
          login: true,
          user,
          cartNum,
          cartProducts: cartView,
          userDetails,
          applyCoupon,
          usedCoupon,
          cartAndWishlist: cartAndWishlstNum,
        });
      } else {
        res.render("user/shoping-cart", {
          login: true,
          user,
          cartNum,
          cartProducts: cartView,
          userDetails,
          applyCoupon,
          usedCoupon: null,
          cartAndWishlist: cartAndWishlstNum,
        });
      }
    } catch (error) {
      console.log(error.message);
      res.redirect("/");
    }
  },

  removeCart: async (req, res) => {
    try {
      let userId = req.session.userId;
      await cartModel.updateOne(
        { userId: userId },
        {
          $set: {
            couponDiscount: 0,
          },
        }
      );
      let userCart = await cartModel.findOne({ userId: userId });

      let productIndex = userCart.products.findIndex(
        (product) => product._id == req.params.cartId
      );
      console.log(productIndex, "productIndexproductIndex");
      let productItem = userCart.products[productIndex];
      if (productIndex != null) {
        userCart.total =
          userCart.total - productItem.price * productItem.quantity;
        userCart.subTotal =
          userCart.subTotal - productItem.price * productItem.quantity;
        userCart.products.splice(productIndex, 1);

        await userCart.save().then(() => {
          res.json({ status: true });
        });
        // res.redirect("/shoping-cart");
      } else {
        res.json({ status: true });
      }
    } catch (error) {
      res.json({ status: false });
    }
  },
  ajnas: (req, res) => {
    console.log(req.body);
    res.send("hiiiiiiiiii");
  },
  QuantityDec: async (req, res) => {
    let userCart = await cartModel.findOne({ userId: req.session.userId });

    let ProductIndex = userCart.products.findIndex(
      (Product) => Product._id == req.params.proid
    );

    let arr = [...userCart.products];

    console.log(arr, "aaaaaaaaaaaaaaaaaaa");
    let productItem = arr[ProductIndex];
    console.log(userCart, "userCartuserCart");
    userCart.total = userCart.total - productItem.price * productItem.quantity;
    userCart.subTotal =
      userCart.subTotal - productItem.price * productItem.quantity;
    productItem.quantity = productItem.quantity - 1;
    arr[ProductIndex] = productItem;
    userCart.total = userCart.total + productItem.price * productItem.quantity;
    userCart.subTotal =
      userCart.subTotal + productItem.price * productItem.quantity;

    await userCart.save();
    res.json({ status: true });
  },
  QuantityInc: async (req, res) => {
    let userCart = await cartModel.findOne({ userId: req.session.userId });
    let productIndex = userCart.products.findIndex(
      (product) => product._id == req.params.proid
    );

    let productItem = userCart.products[productIndex];
    userCart.total = userCart.total - productItem.price * productItem.quantity;
    productItem.quantity = productItem.quantity + 1;
    userCart.products[productIndex] = productItem;
    userCart.total = userCart.total + productItem.price * productItem.quantity;
    userCart.subTotal = userCart.total - userCart.couponDiscount;

    await userCart.save();
    res.json({ status: true });
  },
  changeProductQuantity: (req, res) => {
    let user = req.session.userId;
    userHelpers.changeProductQuantity(req.body, user).then((aj) => {
      res.json(aj);
    });
  },
};
