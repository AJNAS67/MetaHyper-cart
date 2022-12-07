const User = require("../model/userModel");
const productModel = require("../model/product");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

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
    const products = await productModel.find();
    if (req.session.userLogin) {
      res.render("user/home", {
        login: true,
        user: req.session.user,
        products,
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
    console.log(req.body, "login");
    console.log(Email, "email");

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
    res.render("user/product-details", { login: true, user: req.session.user });
  },

  checkout: (req, res) => {
    res.render("user/checkout", { login: true, user: req.session.user });

    // if (req.session.userLogin) {
    //   res.render("user/checkout", { login: true, user: req.session.user });
    // } else {
    //   res.render("user/userlogin", { login: false });
    // }
  },
  mens: (req, res) => {
    res.render("user/mens", { login: true, user: req.session.user });

    // if (req.session.userLogin) {

    //   res.render("user/mens", { login: true, user: req.session.user });
    // } else {
    //   res.render("user/mens", { login: false });
    // }
  },
  womens: (req, res) => {
    if (req.session.userLogin) {
      res.render("user/womens", { login: true, user: req.session.user });
    } else {
      res.render("user/womens", { login: false });
    }
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
};
