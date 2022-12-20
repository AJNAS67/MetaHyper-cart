const User = require("../model/userModel");
const productModel = require("../model/product");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const addressModel = require("../model/addressModel");
const cartModel = require("../model/cart");
const addressModule = require("../model/addressModel");

var otp = Math.random();
otp = otp * 1000000;
otp = parseInt(otp);
console.log(otp);
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
 

  homeView: async (req, res) => {
    let userId = req.session.userId;
    const cartView = await cartModel.findOne({ userId });
    // const cartNum = cartView.products.length;
    // console.log(
    //   cartView,
    //   "cartViewcartViewcartViewcartViewcartViewcartViewcartView"
    // );

    let products = await productModel.find();

    // let aj=products.find()
    if (req.session.userLogin) {
      res.render("user/home", {
        login: true,
        user: req.session.user,
        products,
        // cartNum,
      });
    } else {
      res.render("user/home", { login: false, products });
    }
  },
  // otpget: (req, res) => {
  //   res.render("user.otp");
  // },
  login: async (req, res) => {
    // const { Email, password } = req.body;
    const Email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({
      $and: [{ email: Email }, { status: "Unblocked" }],
    });

    if (!user) {
      console.log("notUser");
      return res.redirect("/signin");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.redirect("/signin");
    }
    req.session.user = user.user_name;
    req.session.userId = user._id;
    req.session.userLogin = true;
    res.redirect("/");
  },
  optPage: (req, res) => {
    res.render("user/otp", { login: false });
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
      res.render("user/userlogin", { login: false });
    } else {
      res.redirect("/");
    }
    // res.render("user/userlogin", { login: false });
  },

  userSignup: (req, res) => {
    res.render("user/usersignup", { login: false });
  },
  shopView: (req, res) => {
    if (req.session.userLogin) {
      res.render("user/shopView", { login: true, user: req.session.user });
    } else {
      res.render("user/shopView", { login: false });
    }
  },

  productDetails: (req, res) => {
    res.render("user/productDetails", { login: true, user: req.session.user });
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

    // if (req.session.userLogin) {
    //   res.render("user/checkout", { login: true, user: req.session.user });
    // } else {
    //   res.render("user/userlogin", { login: false });
    // }
  },
  mens: async (req, res) => {
    try {
      let products = await productModel
        .find({ category: "639acfd61006ac4c0f1e4822" })
        .populate("category");

      res.render("user/mens", {
        login: true,
        user: req.session.user,
        products,
      });
    } catch (error) {}
    // if (req.session.userLogin) {

    //   res.render("user/mens", { login: true, user: req.session.user });
    // } else {
    //   res.render("user/mens", { login: false });
    // }
  },
  womens: async (req, res) => {
    try {
      let products = await productModel
        .find({ category: "6392b46240ab9bd84d9f22f2" })
        .populate("category");

      if (req.session.userLogin) {
        res.render("user/womens", {
          login: true,
          user: req.session.user,
          products,
        });
      } else {
        res.render("user/womens", { login: false, products });
      }
    } catch (error) {}
  },
  contact: (req, res) => {
    if (req.session.userLogin) {
      res.render("user/contact", { login: true, user: req.session.user });
    } else {
      res.render("user/contact", { login: false });
    }
  },

  otp: async (req, res) => {
    UserName = req.body.user_name;
    Email = req.body.email;
    Password = req.body.password;
    Confirm = req.body.confirm;
    console.log(req.body, "ajnas");
    // const { user_name, email, password, confirm } = req.body;
    const user = await User.findOne({ email: Email });
    // const user = false;
    if (!user) {
      console.log("not find");
      // send mail with defined transport object
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

        res.render("user/otp", { login: false });
      });
    } else {
      res.redirect("/signin", { login: false });
    }

    // res.render("user/otp");
  },
  otpVerifi: (req, res) => {
    console.log(otp, "otp");
    var userOtp = [];
    console.log(req.body, "otp");
    for (let value of Object.values(req.body)) {
      console.log(value);
      userOtp.push(value);
    }
    var userOtp = userOtp.join("");
    console.log(userOtp, "userOtpp");
    if (otp == userOtp) {
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
      res.render("user/otp", { msg: "otp is incorrect", login: false });
    }

    console.log(req.body, "body");
    // res.render("user/userlogin");
  },
  resentOpt: (req, res) => {
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

      res.render("user/otp", { login: false });
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
  // doReg:async(req,res)=>{
  //   console.log(req.body,'req.body');
  //   let email=req.body.email;
  //   let password=req.body.password;
  //   const  adminData=new AdminModel({
  //     email,
  //     password

  //   })
  //   await adminData.save().then(()=>{
  //     console.log('adminsaved');
  //     res.send('hiiii')
  //   }).catch((err)=>{
  //     console.log(err,'errin adminlogion');
  //     res.send('errrrrrrrr')
  //   })

  // }
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
      let prodId = req.params.Id;
      let user = req.session.user;
      console.log(prodId, "sdfghjkl");
      let product = await productModel.findOne({ _id: prodId });
      let imageNum = product.image.length;
      console.log(imageNum, "imageNum");

      res.render("user/productDetails", {
        login: true,
        user,
        product,
        imageNum,
      });
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
    console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk");
    console.log(req.body, "boduuuuuuuuuuuuu");
    let addressId = req.params.id;
    console.log(addressId, "addressId");
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
