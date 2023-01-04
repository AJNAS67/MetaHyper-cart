const User = require("../model/userModel");
const productModel = require("../model/product");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const addressModel = require("../model/addressModel");
const cartModel = require("../model/cart");
const addressModule = require("../model/addressModel");
const categoryModel = require("../model/category");
const orderModule = require("../model/orderModule");
const moment = require("moment");
const { pieChartDetails } = require("../middleware/pieChart");

const flash = require("connect-flash");
function otpCreation() {
  var otp = Math.random();
  var otp = otp * 1000000;
  otp = parseInt(otp);

  return otp;
}
// var otp = Math.random();
// otp = otp * 1000000;
// otp = parseInt(otp);
// console.log(otp);
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  service: "Gmail",

  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

var UserName;
var Email;
var Password;
var Confirm;

module.exports = {
  getShopByCategory: async (req, res) => {
    const minPrice = req.query.minPrice || 100;
    const maxPrice = req.query.maxPrice || 5000;
    console.log(minPrice, "minPriceminPrice");
    var query = await productModel.find().populate({
      path: "category",
      match: {
        category: { $eq: "Women" },
      },
    });

    var product = query.filter(function (el) {
      return el.price >= minPrice && el.price <= maxPrice;
    });

    var products = [];
    product.forEach((elements) => {
      if (elements.category !== null) {
        products.push(elements);
      }
    });

    if (req.session.userLogin) {
      res.render("user/womens", {
        login: true,
        user: req.session.user,
        products,
      });
    } else {
      res.render("user/womens", { login: false, products });
    }
  },
  getMenPriceFilter: async (req, res) => {
    const minPrice = req.query.minPrice || 100;
    const maxPrice = req.query.maxPrice || 5000;
    console.log(minPrice, "minPriceminPrice");
    var query = await productModel.find().populate({
      path: "category",
      match: {
        category: { $eq: "Men" },
      },
    });

    var product = query.filter(function (el) {
      return el.price >= minPrice && el.price <= maxPrice;
    });

    var products = [];
    product.forEach((elements) => {
      if (elements.category !== null) {
        products.push(elements);
      }
    });
    if (req.session.userLogin) {
      res.render("user/mens", {
        login: true,
        user: req.session.user,
        products,
      });
    } else {
      res.render("user/mens", { login: false, products });
    }
  },

  getKidsPriceFilter: async (req, res) => {
    const minPrice = req.query.minPrice || 100;
    const maxPrice = req.query.maxPrice || 5000;
    var query = await productModel.find().populate({
      path: "category",
      match: {
        category: { $eq: "Kids" },
      },
    });

    var product = query.filter(function (el) {
      return el.price >= minPrice && el.price <= maxPrice;
    });

    var products = [];
    product.forEach((elements) => {
      if (elements.category !== null) {
        products.push(elements);
      }
    });
    if (req.session.userLogin) {
      res.render("user/kids", {
        login: true,
        user: req.session.user,
        products,
      });
    } else {
      res.render("user/kids", { login: false, products });
    }
  },
  getCosmeticsFilter: async (req, res) => {
    const minPrice = req.query.minPrice || 100;
    const maxPrice = req.query.maxPrice || 5000;
    var query = await productModel.find().populate({
      path: "category",
      match: {
        category: { $eq: "Cosmetics" },
      },
    });

    var product = query.filter(function (el) {
      return el.price >= minPrice && el.price <= maxPrice;
    });

    var products = [];
    product.forEach((elements) => {
      if (elements.category !== null) {
        products.push(elements);
      }
    });
    if (req.session.userLogin) {
      res.render("user/cosmetics", {
        login: true,
        user: req.session.user,
        products,
      });
    } else {
      res.render("user/cosmetics", { login: false, products });
    }
  },

  getAccessoriesFilter: async (req, res) => {
    const minPrice = req.query.minPrice || 100;
    const maxPrice = req.query.maxPrice || 5000;
    var query = await productModel.find().populate({
      path: "category",
      match: {
        category: { $eq: "Accessories" },
      },
    });

    var product = query.filter(function (el) {
      return el.price >= minPrice && el.price <= maxPrice;
    });

    var products = [];
    product.forEach((elements) => {
      if (elements.category !== null) {
        products.push(elements);
      }
    });
    if (req.session.userLogin) {
      res.render("user/accessories", {
        login: true,
        user: req.session.user,
        products,
      });
    } else {
      res.render("user/accessories", { login: false, products });
    }
  },

  homeView: async (req, res) => {
    let userId = req.session.userId;

    // const cartNum = cartView.products.length;
    // console.log(
    //   cartView,
    //   "cartViewcartViewcartViewcartViewcartViewcartViewcartView"
    // );

    // let catogoey = await categoryModel.find();
    let products = await productModel.find().populate("category");

    if (req.session.userLogin) {
      let userDetail = await User.findById(userId);
      let applycoupen = userDetail.applyCoupon;
      const cartView = await cartModel.findOne({ userId });
      res.render("user/home", {
        login: true,
        user: req.session.user,
        products,
        applycoupen,
        // cartNum,
      });
    } else {
      res.render("user/home", {
        login: false,
        products,
        applycoupen: false,
        aj: true,
        user: null,
      });
    }
  },

  login: async (req, res) => {
    const Email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({
      $and: [{ email: Email }, { status: "Unblocked" }],
    });

    if (!user) {
      console.log("notUser");

      const error = "User Email not found";
      req.flash("user", error);
      return res.redirect("/signin");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = "password incorrect";
      req.flash("user", error);
      return res.redirect("/signin");
    }
    req.session.user = user.user_name;
    req.session.userId = user._id;
    req.session.userLogin = true;
    res.redirect("/");
  },
  optPage: (req, res) => {
    const otpError = req.flash("message");

    res.render("user/otpPage", { login: false, otpError });
  },

  shop: (req, res) => {
    if (req.session.userLogin) {
      res.render("user/shop", { login: true, user: req.session.user });
    } else {
      res.render("user/shop", { login: false });
    }
  },
  userlogin: (req, res) => {
    if (!req.session.userLogin) {
      const loginError = req.flash("user");
      res.render("user/userlogin", { login: false, loginError });
    } else {
      res.redirect("/");
    }
  },

  userSignup: (req, res) => {
    const userExistError = req.flash("user");

    res.render("user/usersignup", { login: false, userExistError });
  },
  shopView: (req, res) => {
    if (req.session.userLogin) {
      res.render("user/shopView", { login: true, user: req.session.user });
    } else {
      res.render("user/shopView", { login: false });
    }
  },

  productDetails: (req, res) => {
    try {
      let user = req.session.user;
      if (user) {
        res.render("user/productDetails", { login: true, user });
      } else {
        res.render("user/productDetails", {
          login: false,
          user: null,
        });
      }
    } catch (error) {
      console.log(error.message);
      res.redirect("/");
    }
  },

  checkout: async (req, res) => {
    try {
      let user = req.session.user;
      let userId = req.session.userId;
      const userDetail = await User.findById(userId);

      let cartDetail = await cartModel.findOne({ userId });

      res.render("user/checkout", {
        login: true,
        user,
        userDetail,
        cartDetail,
      });
    } catch (error) {
      res.status(429).render("admin/error-429");
    }
  },
  mens: async (req, res) => {
    try {
      var query = await productModel.find().populate({
        path: "category",
        match: {
          category: { $eq: "Men" },
        },
      });
      let products = [];
      query.forEach((elements) => {
        if (elements.category !== null) {
          products.push(elements);
        }
      });

      if (req.session.userLogin) {
        res.render("user/mens", {
          login: true,
          user: req.session.user,
          products,
        });
      } else {
        res.render("user/mens", { login: false, products, user: null });
      }
    } catch (error) {
      res.redirect("/");
    }
  },
  womens: async (req, res) => {
    try {
      var query = await productModel.find().populate({
        path: "category",
        match: {
          category: { $eq: "Women" },
        },
      });
      let products = [];
      query.forEach((elements) => {
        if (elements.category !== null) {
          products.push(elements);
        }
      });
      if (req.session.userLogin) {
        res.render("user/womens", {
          login: true,
          user: req.session.user,
          products,
        });
      } else {
        res.render("user/womens", { login: false, products, user: null });
      }
    } catch (error) {
      res.redirect("/");
    }
  },
  kids: async (req, res) => {
    try {
      var query = await productModel.find().populate({
        path: "category",
        match: {
          category: { $eq: "Kids" },
        },
      });
      let products = [];
      query.forEach((elements) => {
        if (elements.category !== null) {
          products.push(elements);
        }
      });

      if (req.session.userLogin) {
        res.render("user/kids", {
          login: true,
          user: req.session.user,
          products,
        });
      } else {
        res.render("user/kids", { login: false, products, user: null });
      }
    } catch (error) {
      res.redirect("/");
    }
  },
  cosmetics: async (req, res) => {
    try {
      var query = await productModel.find().populate({
        path: "category",
        match: {
          category: { $eq: "Cosmetics" },
        },
      });
      let products = [];
      query.forEach((elements) => {
        if (elements.category !== null) {
          products.push(elements);
        }
      });

      if (req.session.userLogin) {
        res.render("user/cosmetics", {
          login: true,
          user: req.session.user,
          products,
        });
      } else {
        res.render("user/cosmetics", { login: false, productsm, user: null });
      }
    } catch (error) {
      res.redirect("/");
    }
  },
  Accessories: async (req, res) => {
    try {
      var query = await productModel.find().populate({
        path: "category",
        match: {
          category: { $eq: "Accessories" },
        },
      });
      let products = [];
      query.forEach((elements) => {
        if (elements.category !== null) {
          products.push(elements);
        }
      });

      if (req.session.userLogin) {
        res.render("user/accessories", {
          login: true,
          user: req.session.user,
          products,
        });
      } else {
        res.render("user/accessories", { login: false, products, user: null });
      }
    } catch (error) {
      res.redirect("/");
    }
  },
  contact: (req, res) => {
    if (req.session.userLogin) {
      res.render("user/contact", { login: true, user: req.session.user });
    } else {
      res.render("user/contact", { login: false });
    }
  },

  forgetPassword: (req, res) => {
    const usernotfindError = req.flash("message");

    res.render("user/forgot-password", { login: false, usernotfindError });
  },

  otpForForget: async (req, res) => {
    Email = req.body.email;
    const user = await User.findOne({ email: Email });
    // const user = false;
    if (user) {
      otp = otpCreation();
      var mailOptions = {
        to: Email,
        subject: "Otp for registration is: ",
        html:
          "<h3>OTP for account verification is </h3>" +
          "<h1 style='font-weight:bold;'>" +
          otp +
          "</h1>", // html body
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error), "otp errorrrrrrrrrr";
        }
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // const otpError = req.flash("message");

        res.redirect("/otp");
      });
    } else {
      const error = "Invalid email !!Please check your Email address ";
      req.flash("message", error);

      res.redirect("/forgetPassword");
    }
  },
  getResetPassword: (req, res) => {
    const userInvalid = req.flash("message");

    res.render("user/reset-password", { login: false, userInvalid });
  },
  resetPassword: async (req, res) => {
    let password1 = req.body.password;
    let email = req.body.email;

    try {
      const user = await User.findOne({ email: req.body.email });

      if (user) {
        let password = await bcrypt.hash(password1, 10);
        await User.findOneAndUpdate(
          { email: email },
          { $set: { password: password } }
        );
        res.redirect("/signin");
      } else {
        req.flash("message", "Sorry ! Your Email Not Found !!");

        res.redirect("/resetPassword");
      }
    } catch (error) {}
  },

  otp: async (req, res) => {
    UserName = req.body.user_name;
    Email = req.body.email;
    Password = req.body.password;
    Confirm = req.body.confirm;
    // const { user_name, email, password, confirm } = req.body;
    const user = await User.findOne({ email: Email });
    // const user = false;
    if (!user) {
      console.log("not find");
      // send mail with defined transport object
      otp = otpCreation();

      var mailOptions = {
        to: Email,
        subject: "Otp for registration is: ",
        html:
          "<h3>OTP for account verification is </h3>" +
          "<h1 style='font-weight:bold;'>" +
          otp +
          "</h1>", // html body
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error), "otp errorrrrrrrrrr";
        }
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        res.redirect("/otp");
      });
    } else {
      const error = "Existing emial!! user can login using email address ";
      req.flash("user", error);

      res.redirect("/signup");
    }
  },
  otpVerifi: (req, res) => {
    var userOtp = [];
    for (let value of Object.values(req.body)) {
      console.log(value);
      userOtp.push(value);
    }
    var userOtp = userOtp.join("");
    console.log(userOtp, "userOtpp");
    console.log(UserName, "UserNameUserName");
    if (otp == userOtp) {
      if (UserName) {
        const newUser = new User({
          user_name: UserName,
          email: Email,
          password: Password,
          confirm: Confirm,
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;

            newUser
              .save()
              .then(() => {
                res.redirect("/signin");
              })
              .catch((err) => {
                console.log(err);
                res.redirect("/signin");
              });
          });
        });
      } else {
        res.redirect("/resetPassword");
      }
    } else {
      const error = "Invalid OTP ! Please Enter valid OTP";
      req.flash("message", error);

      res.redirect("/otp");
    }

    console.log(req.body, "body");
    // res.render("user/userlogin");
  },
  resentOpt: (req, res) => {
    otp = otpCreation();

    var mailOptions = {
      to: Email,
      subject: "Otp for registration is: ",
      html:
        "<h3>OTP for account verification is </h3>" +
        "<h1 style='font-weight:bold;'>" +
        otp +
        "</h1>", // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error), "otp errorrrrrrrrrr";
      }
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

      res.render("user/otpPage", { login: false });
    });
  },

  // doLogin: (req, res, next) => {
  //   passport.authenticate("local", {
  //     successRedirect: "/",
  //     failureRedirect: "/signin",
  //     failureMessage: true,
  //     user: req.body.email,
  //   })(req, res, next);
  //   console.log(req.body, "passsssssssssssssssssssss");

  // },
  signUp: (req, res) => {
    const { user_name, email, password, confirm } = req.body;
    if (!user_name || !email || !password || !confirm) {
      console.log("Fill empty fields");
    }

    //Confirm Passwords
    if (password !== confirm) {
      console.log("Password must match");
    } else {
      //Validation
      User.findOne({ email: email }).then((user) => {
        if (user) {
          console.log("email exists");
          res.render("user/usersignup", {
            user_name,
            email,
            password,
            confirm,
          });
        } else {
          //Validation
          const newUser = new User({
            user_name: user_name,
            email: email,
            password: password,
            confirm: confirm,
          });
          //Password Hashing
          bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(res.redirect("signin"))
                .catch((err) => console.log(err, "errrrrrr"));
            })
          );
        }
      });
    }

    // res.render("user/otp");
  },
  // doLogout: (req, res) => {
  //   req.logout(function (err) {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       res.redirect("/");
  //     }
  //   });
  // },
  logout: (req, res) => {
    req.session.loggedOut = true;
    // if(req.session.loggedOut){
    req.session.destroy();
    res.redirect("/");
    // }
  },

  doRegister: (req, res) => {
    res.render("user/usersignup");
  },

  profile: async (req, res) => {
    try {
      let userId = req.session.userId;
      let user = req.session.user;

      const userDetail = await User.findById(userId);

      res.render("user/profile", { login: true, userDetail, user });

      //   addressModel.find({ userId: req.session.userId }).then((result) => {
      //     res.render("user/profile", {
      //       user,
      //       session: req.session,
      //       addresses: result,
      //       login: true,
      //     });
      //   });
    } catch (err) {
      res.status(429).render("admin/error-429");
    }
  },
  prodDetail: async (req, res) => {
    try {
      let user = req.session.user;
      let prodId = req.params.Id;
      let product = await productModel.findOne({ _id: prodId }).populate("category")
      let imageNum = product.image.length;

      if (user) {
        res.render("user/productDetails", {
          login: true,
          user,
          product,
          imageNum,
        });
      } else {
        res.render("user/productDetails", {
          login: false,
          user: null,
          product,
          imageNum,
        });
      }
    } catch (error) {}
  },
  addAddress: (req, res) => {
    try {
      let user = req.session.user;
      res.render("user/addAdress", { login: true, user, session: req.session });
    } catch (error) {
      res.status(429).render("admin/error-429");
    }
  },
  doAddaddress: async (req, res) => {
    console.log(req.body, "addre");
    console.log(req.session.userId, "userId");
    const userModel = await User.findOne({ _id: req.session.userId });
    console.log(userModel, "userModel");
    try {
      userModel.address.unshift({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        mobNumber: req.body.phone,
        email: req.body.email,
        appartment: req.body.appartment,
        homeaddress: req.body.address,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
        zipcode: req.body.zipcode,
      });
      userModel.save().then(() => {
        res.redirect("/userProfile");
      });
    } catch (error) {
      console.log(error.message);
    }

    // try {
    //   const address = await User({
    //     firstName: req.body.firstName,
    //     lastName: req.body.lastName,
    //     mobNumber: req.body.phone,
    //     email: req.body.email,
    //     appartment: req.body.appartment,
    //     homeaddress: req.body.address,
    //     city: req.body.city,
    //     state: req.body.state,
    //     country: req.body.country,
    //     zipcode: req.body.zipcode,
    //     userId: req.session.userId,
    //   });
    //   address.save().then((result) => {});
    //   res.redirect("/userProfile");
    // } catch (error) {
    //   res.status(429).render("admin/error-429");
    // }
  },
  editprofile: async (req, res) => {
    let addressId = req.params.id;
    let userId = req.session.userId;
    const userModel = await User.updateOne(
      { userId, address: { $elemMatch: { _id: addressId } } },
      {
        $set: {
          "address.$.firstName": req.body.firstName,
          "address.$.lastName": req.body.lastName,
          "address.$.mobNumber": req.body.phone,
          "address.$.city": req.body.city,
          "address.$.homeaddress": req.body.address,
          "address.$.zipcode": req.body.zipcode,
          "address.$.email": req.body.email,
          "address.$.country": req.body.country,
          "address.$.state": req.body.state,
          "address.$.appartment": req.body.appartment,
        },
      }
    )
      .then((rk) => {
        console.log(rk, "res update");
        res.redirect("/userProfile");
      })
      .catch((err) => {
        console.log(err.message);
        res.redirect("/userProfile");
      });
  },

  deleteAdress: async (req, res) => {
    try {
      let userId = req.session.userId;
      let index = req.params.index;
      const user = await User.findById(userId);
      user.address.splice(index, 1);
      user.save();
      res.redirect("/userProfile");
    } catch (error) {
      console.log(error.message);
      res.redirect("/userProfile");
    }
  },
};
