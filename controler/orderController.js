const userModule = require("../model/userModel");
const cartModel = require("../model/cart");
const orderModel = require("../model/orderModule");
const productModel = require("../model/product");

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
        console.log(result, "resultresultresult");
        // let result =await orderModel.find()
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

    // let user=req.session.user;

    userId = req.session.userId;
    const user = await userModule.findById(userId);
    let deliveryAddress = user.address[address];

    let cart = await cartModel.findOne({ userId });
    console.log(cart,'cartcartcart');
    
    let proId = cart.products;
    function getNthDate(nthDate) {
      let date = new Date();
      return new Date(date.setDate(date.getDate() + nthDate));
    }
    var estimatedDate = getNthDate(6);
    var estimatedDate = estimatedDate.toLocaleDateString();
    var amount = parseInt(cart.subTotal);
    if (paymentMethod == "Cash On Delivery") {
      const newOrder = new orderModel({
        userId: userId,
        deliveryAddress: deliveryAddress,
        products: cart.products,
        quantity: cart.products.length,
        total: cart.subTotal,
        paymentMethod: paymentMethod,
        paymentStatus: "Payment Pending",
        orderStatus: "orderconfirmed",
        track: "orderconfirmed",
        estimatedDate: estimatedDate,
      });
      newOrder.save().then((result) => {
        req.session.orderId = result._id;
        productModel
          .updateOne(
            {
              _id: proId,
            },
            {
              $inc: {
                quantity: -1,
              },
            }
          )
          .then((res) => {
            console.log(res);
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
        total: cart.subTotal,
        paymentMethod: paymentMethod,
        paymentStatus: "Payment Completed",
        orderStatus: "orderconfirmed",
        track: "orderconfirmed",
        estimatedDate: estimatedDate,
      });
      await cart.remove();
      newOrder.save().then((result) => {
        let userOrderData = result;
        console.log(result, "result");
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
            };
            res.json(response);
          }
        );
      });
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

    // const order = await orderModel.find({ _id: orderdata.userOrderData._id });
    userHelpers
      .veryfiyPayment(orderdata)
      .then(() => {
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
    res.send("hi");
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
};
