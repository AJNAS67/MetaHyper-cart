const userModule = require("../model/userModel");
const cartModel = require("../model/cart");
const orderModel = require("../model/orderModule");
const productModel = require("../model/product");
const { default: mongoose } = require("mongoose");

const Razorpay = require("razorpay");
const userHelpers = require("../helpers/user-helper");

var instance = new Razorpay({
  key_id: process.env.YOUR_KEY_ID,
  key_secret: process.env.YOUR_KEY_SECRET,
});

module.exports = {
  viewOrders: async (req, res) => {
    // let user = req.session.user;
    // console.log(user, "user");
    // res.render("user/view-orders", { login: true, user });
    if (req.session.userLogin) {
      try {
        let user = req.session.user;
        let result = await orderModel
          .find({ userId: req.session.userId })
          .sort({ createdAt: -1 });
        res.render("user/view-orders", {
          login: true,
          user,
          session: req.session,
          Orders: result,
        });
      } catch (err) {
        res.use((req, res) => {
          res.status(429).render("admin/error-429");
        });
      }
    } else {
      res.redirect("/login");
    }
  },
  postCheckOut: async (req, res) => {
    const { address, paymentMethod } = req.body;
    let userId = req.session.userId;
    const user = await userModule.findById(userId);

    if (user.applyCoupon) {
      console.log("have copen");
      await userModule
        .updateOne(
          { _id: userId },
          {
            $set: {
              applyCoupon: false,
            },
          }
        )
        .then((rss) => {
          console.log(rss, "rss");
        });
    }

    // let user=req.session.user;

    let deliveryAddress = user.address[address];

    let cart = await cartModel.findOne({ userId });
    let subtotal = cart.subTotal;

    function getNthDate(nthDate) {
      let date = new Date();
      return new Date(date.setDate(date.getDate() + nthDate));
    }
    var estimatedDate = getNthDate(6);
    var estimatedDate = estimatedDate.toLocaleDateString();
    var amount = parseInt(subtotal);
    if (paymentMethod == "Cash On Delivery") {
      const newOrder = new orderModel({
        userId: userId,
        deliveryAddress: deliveryAddress,
        products: cart.products,
        quantity: cart.products.length,
        total: subtotal,
        paymentMethod: paymentMethod,
        paymentStatus: "Payment Pending",
        orderStatus: "orderconfirmed",
        track: "orderconfirmed",
        estimatedDate: estimatedDate,
      });
      newOrder.save().then(async (result) => {
        req.session.orderId = result._id;

        let order = await orderModel.findOne({ _id: result._id });
        const findProductId = order.products;
        findProductId.forEach(async (el) => {
          let removeQuantity = await productModel.findOneAndUpdate(
            { _id: el.ProductId },
            { $inc: { quantity: -el.quantity } }
          );
        });

        cartModel.findOneAndRemove({ userId: result.userId }).then((result) => {
          res.json({ cashOnDelivery: true });
        });
      });
    } else if (paymentMethod == "Online Payment") {
      const newOrder = new orderModel({
        userId: userId,
        deliveryAddress: deliveryAddress,
        products: cart.products,
        quantity: cart.products.length,
        total: subtotal,
        paymentMethod: paymentMethod,
        paymentStatus: "Payment Completed",
        orderStatus: "orderconfirmed",
        track: "orderconfirmed",
        estimatedDate: estimatedDate,
      });
      await cart.remove();
      newOrder.save().then((result) => {
        let userOrderData = result;
        // console.log(result, "result");
        let orderId = result._id.toString();

        instance.orders.create(
          {
            amount: amount * 100,
            currency: "INR",
            receipt: orderId,
            notes: {
              key1: process.env.YOUR_KEY_ID,
              key2: "value2",
            },
          },
          (err, order) => {
            let response = {
              onlinePayment: true,
              razorpayOrderData: order,
              userOrderData: userOrderData,
              amount: amount,
            };
            res.json(response);
          }
        );
      });
    } else {

      const walletBlance = user.useWallet;
      if (walletBlance == 0) {
        res.json({ noBalane: true });
      } else {
        if (walletBlance < subtotal) {
          const balancePayment = subtotal - walletBlance;
          const newOrder = new orderModel({
            userId: userId,
            deliveryAddress: deliveryAddress,
            products: cart.products,
            quantity: cart.products.length,
            total: subtotal,
            paymentMethod: paymentMethod,
            paymentStatus: "Payment Completed",
            orderStatus: "orderconfirmed",
            track: "orderconfirmed",
            estimatedDate: estimatedDate,
          });

          newOrder.save().then((result) => {
            let userOrderData = result;
            console.log(result, "result");
            let orderId = result._id.toString();

            instance.orders.create(
              {
                amount: balancePayment * 100,
                currency: "INR",
                receipt: orderId,
                notes: {
                  key1: process.env.YOUR_KEY_ID,
                  key2: "value2",
                },
              },
              (err, order) => {
                let response = {
                  onlinePayment: true,
                  razorpayOrderData: order,
                  userOrderData: userOrderData,
                  walletBalance: walletBlance,
                  amount: amount,
                };
                res.json(response);
              }
            );
          });
        } else {
          const newOrder = new orderModel({
            userId: userId,
            deliveryAddress: deliveryAddress,
            products: cart.products,
            quantity: cart.products.length,
            total: subtotal,
            paymentMethod: paymentMethod,
            paymentStatus: "Payment Completed",
            orderStatus: "orderconfirmed",
            track: "orderconfirmed",
            estimatedDate: estimatedDate,
          });
          newOrder.save().then(async (result) => {
            req.session.orderId = result._id;

            // quantity check
            let order = await orderModel.findOne({ _id: result._id });
            const findProductId = order.products;

            findProductId.forEach(async (el) => {
              let removeQuantity = await productModel.findOneAndUpdate(
                { _id: el.ProductId },
                { $inc: { quantity: -el.quantity } }
              );
            });
            let walletAmount = await userModule.findOneAndUpdate(
              { _id: userId },
              { $inc: { useWallet: -subtotal } }
            );

            // remove chart
            await cartModel
              .findOneAndRemove({ userId: result.userId })
              .then((result) => {
                res.json({ wallet: true });
              });
          });
        }
      }
    }
  },
  postPaymentFailed: async (req, res) => {
    let id = req.body.userOrderData._id;

    await orderModel.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          orderStatus: "Pending",
          paymentStatus: "Payment Failed",
          track: "Payment Error",
        },
      }
    );

    res.json({ status: true });
  },
  doVerifyPayment: async (req, res) => {
    let orderdata = req.body;
    let walletBalance = parseInt(orderdata.walletBalance);

    userHelpers
      .veryfiyPayment(orderdata)
      .then(async (rs) => {
        if (orderdata.userOrderData.paymentMethod == "Wallet") {
        
          let walletAmount = await userModule.findOneAndUpdate(
            { _id: req.session.userId },
            { $inc: { useWallet: -walletBalance } }
          );
          const findProductId = orderdata.userOrderData.products;
          findProductId.forEach(async (el) => {
            await productModel.findOneAndUpdate(
              { _id: el.ProductId },
              { $inc: { quantity: -el.quantity } }
            );
          });

          // cart remove
          await cartModel.findOneAndRemove({ userId: req.session.userId });
        }
        
        res.json({ status: true });
      })
      .catch(async (err) => {
        await orderModel
          .updateOne(
            {
              _id: orderdata.userOrderData._id,
            },
            {
              $set: {
                orderStatus: "Pending",
                paymentStatus: "Payment Failed",
              },
            }
          )
          .then((rk) => {
            console.log(rk, "payment status");
            res.json({ status: "Payment Failed" });
          });
        // order.paymentStatus = "Payment Failed ";
        // order.orderStatus = "Pending";

        // order.save();
        // res.json({ status: "Payment Failed" });
      });
  },
  postOderSuccess: async (req, res) => {
    try {
      let user = req.session.user;
      req.session.orderId = req.query.id;
      let result = await orderModel
        .findById(req.query.id)
        .populate("products")
        .populate("deliveryAddress");
      // result.products.map(result.products)

      res.render("user/orderSummery", {
        login: true,
        id: result,
        session: req.session,
        user,
      });
    } catch (error) {
      res.status(429).render("admin/error-429");
    }
  },
  getTracking: async (req, res) => {
    try {
      let user = req.session.user;
      let orderId = req.query.id;
      let order = await orderModel.findById({ _id: orderId });
      res.render("user/orderTracking", { login: true, user, order });
    } catch (error) {}
  },
  getCancelOrder: async (req, res) => {
    try {
      let orderId = req.query.id;
      console.log(orderId, "orderId");

      let order = await orderModel
        .findByIdAndUpdate(orderId, {
          orderStatus: "Cancellede",
          track: "Cancellede",
        })
        .then((re) => {
          console.log(re, "uuuuuuuuuuuuuuu");
        });
    } catch (error) {
      res.status(429).render("admin/error-429");
    }
  },

  returnOrder: async (req, res) => {
    let userId = req.session.userId;
    try {
      let oid = mongoose.Types.ObjectId(req.body.oid.trim());
      const order = await orderModel.findById(oid);
      var prodPrice = order.total;
      var prodPrice = parseInt(prodPrice);
      let value = req.body.value;
      await userModule
        .updateOne({ _id: userId }, { $set: { useWallet: prodPrice } })
        .then((rr) => {
          console.log(rr, "set wallet price");
        });

      await orderModel
        .findByIdAndUpdate(oid, {
          track: "Returnd",
          orderStatus: "Returnd",
          returnreason: value,
        })
        .then((response) => {
          res.json({ status: true });
        });
    } catch (error) {
      res.status(429).render("admin/error-429");
    }
  },
};
