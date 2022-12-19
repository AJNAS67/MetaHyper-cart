const userModule = require("../model/userModel");
const cartModel = require("../model/cart");
const orderModel = require("../model/orderModule");
const productModel = require("../model/product");

const Razorpay = require("razorpay");
const userHelpers = require("../helpers/user-helper");

var instance = new Razorpay({
  key_id: "rzp_test_NMcDXbybMYWLne",
  key_secret: "nDdPik0bxue6f3gjqtDGIykW",
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
    console.log(address, "address");
    console.log(paymentMethod, "paymentmethord");
    // let user=req.session.user;

    userId = req.session.userId;
    const user = await userModule.findById(userId);
    let deliveryAddress = user.address[address];

    let cart = await cartModel.findOne({ userId });
    let proId = cart.products;
    function getNthDate(nthDate) {
      let date = new Date();
      return new Date(date.setDate(date.getDate() + nthDate));
    }
    var estimatedDate = getNthDate(6);
    var estimatedDate = estimatedDate.toLocaleDateString();
    var amount = parseInt(cart.total);
    if (paymentMethod == "Cash On Delivery") {
      const newOrder = new orderModel({
        userId: userId,
        deliveryAddress: deliveryAddress,
        products: cart.products,
        quantity: cart.products.length,
        total: cart.total,
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
        total: cart.total,
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
              key1: "value3",
              key2: "value2",
            },
          },
          (err, order) => {
            console.log(order, "orer");
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
  postPaymentFailed: (req, res) => {
    res.json({ status: true });
  },
  doVerifyPayment: (req, res) => {
    userHelpers
      .veryfiyPayment(req.body)
      .then(() => {
        console.log("stat");
        res.json({ status: true });
      })
      .catch((err) => {
        res.json({ status: "Payment Failed" });
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
};
