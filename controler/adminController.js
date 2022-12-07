const express = require("express");
const bcrypt = require("bcrypt");
const UserModel = require("../model/userModel");
const categoryModel = require("../model/category");
const adminData = require("../model/adminModel");

// const AdminModel = require("../model/AdminModel");


module.exports = {
  //login page
  admin: (req, res) => {
    if (!req.session.adminLogin) {
      res.render("admin/adminlogin");
    } else {
      res.redirect("/admin/Home");
    }
  },
  adminHome: (req, res) => {
    if (req.session.adminLogin) {
      res.render("admin/adminHome");
    }
  },
  adminLogin: async (req, res) => {
    const { email, password } = req.body;

    // var aPassword = "admin";
    // var aEmail = "admin@gmail.com";
    const admin = await adminData.findOne({ email });

    if (!admin) {
      return res.render("admin/adminlogin");
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      console.log("not math");
      return res.redirect("/admin");
    }
    req.session.adminLogin = true;
    res.redirect("/admin/adminlog");

    // if (aEmail == email) {
    //   var isAdmin = true;
    // }

    // if (!isAdmin) {
    //   return res.redirect("/admin");
    // }

    // req.session.adminLogin = true;
    // res.redirect("/admin/adminlog");
  },

  adminProductsView: (req, res) => {
    res.render("admin/viewproducts");
  },
  addProduct: async (req, res) => {
    const category = await categoryModel.find();
    res.render("admin/addproducts", { category: category });
  },
  viewCategory: async (req, res) => {
    const category = await categoryModel.find();

    res.render("admin/viewcategory", { category: category });
  },
  viewUser: async (req, res) => {
    const users = await UserModel.find({});
    res.render("admin/viewuser", { users, index: 1 });
  },
  Home: (req, res) => {
    if (req.session.adminLogin) {
      res.render("admin/adminHome");
    }
  },
  product: (req, res) => {
    res.send("hii");
  },

  blockUser: async (req, res) => {
    const id = req.params.id;
    await UserModel.findByIdAndUpdate(
      { _id: id },
      { $set: { status: "Blocked" } }
    ).then(() => {
      res.redirect("/admin/viewUser");
    });
  },
  unblockUser: async (req, res) => {
    const id = req.params.id;
    await UserModel.findByIdAndUpdate(
      { _id: id },
      { $set: { status: "Unblocked" } }
    ).then(() => {
      res.redirect("/admin/viewUser");
    });
  },
};
