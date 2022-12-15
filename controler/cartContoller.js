const cartModel = require("../model/cart");
const productModel = require("../model/product");
const { login } = require("./userController");
const express = require("express");
const userHelpers = require("../helpers/user-helper");

const app = express();

module.exports = {
  addTocart: async (req, res) => {
    try {
      let User = req.session.user;
      let quantity = 1;
      let name = req.body.name;
      let price = req.body.price;
      const ProductId = req.params.prodId;
      const findProduct = await productModel.findById(ProductId);
      const userId = req.session.userId;
      let cart = await cartModel.findOne({ userId });

      if (cart) {
        let itemIndex = cart.products.findIndex(
          (p) => p.ProductId == ProductId
        );
        if (itemIndex > -1) {
          let productItem = cart.products[itemIndex];
          productItem.quantity += quantity;
        } else {
          cart.products.push({ ProductId, quantity, name, price });
        }
        cart.total = cart.products.reduce((acc, curr) => {
          return acc + curr.quantity * curr.price;
        }, 0);
        await cart.save();
        res.redirect("/shoping-cart");
      } else {
        const total = quantity * price;
        cart = new cartModel({
          userId: userId,
          products: [{ ProductId, quantity, name, price }],
          total: total,
        });
        await cart.save();
        res.redirect("/shoping-cart");
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

    try {
      let userId = req.session.userId;
      const cartView = await cartModel
        .findOne({ userId })
        .populate("products.ProductId")
        .exec();

      if (cartView) {
        req.session.cartNum = cartView.products.length;
      }
      cartNum = req.session.cartNum;
      res.render("user/shoping-cart", {
        login: true,
        user,
        cartNum,
        cartProducts: cartView,
      });
    } catch (error) {
      console.log(error.message);
    }
  },

  removeCart: async (req, res) => {
    let userCart = await cartModel.findOne({ userId: req.session.userId });
    let productIndex = userCart.products.findIndex(
      (product) => product._id == req.params.cartId
    );
    let productItem = userCart.products[productIndex];
    if (productIndex != null) {
      userCart.total =
        userCart.total - productItem.price * productItem.quantity;
      userCart.products.splice(productIndex, 1);
      await userCart.save();
      res.redirect("/shoping-cart");
    } else {
      res.redirect("/");
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

    let productItem = arr[ProductIndex];
    userCart.total = userCart.total - productItem.price * productItem.quantity;
    productItem.quantity = productItem.quantity - 1;
    arr[ProductIndex] = productItem;
    userCart.total = userCart.total + productItem.price * productItem.quantity;

    userCart.save();
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
