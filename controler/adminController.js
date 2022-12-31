const express = require("express");
const bcrypt = require("bcrypt");
const UserModel = require("../model/userModel");
const categoryModel = require("../model/category");
const adminData = require("../model/adminModel");
const orderModule = require("../model/orderModule");
const productModel = require("../model/product");

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
  adminHome: async (req, res) => {
    if (req.session.adminLogin) {
      let currentDate = new Date();
      let today = currentDate.getDate();
      let startdate;
      if (today <= 7) {
        startdate = 1;
      } else {
        startdate = today - 7;
      }
      console.log(today, "today");
      console.log(startdate, "start dat");
      let month = currentDate.getMonth();
      console.log(month, "month");
      let year = currentDate.getFullYear();
      console.log(year, "year");


      const TodaySalesT = await orderModule.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(
                new Date(year, month, currentDate).setHours(00, 00, 00)
              ),
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$total" },
          },
        },
      ]);


      const weaklySalesT = await orderModule.aggregate([
        {
          $match: {
            createdAt: {
              $gt: new Date(
                new Date(year, month, startdate).setHours(00, 00, 00)
              ),
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$total" },
          },
        },
      ]);
      const monthlySalesT = await orderModule.aggregate([
        {
          $match: {
            createdAt: {
              $gt: new Date(new Date(year, month, 1).setHours(00, 00, 00)),
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$total" },
          },
        },
      ]);

      var prodWomen = await productModel.find().populate({
        path: "category",
        match: {
          category: { $eq: "Women" },
        },
      });

      var WomenCount = [];
      prodWomen.forEach((elements) => {
        if (elements.category !== null) {
          WomenCount.push(elements);
        }
      });
      console.log(WomenCount.length, "WomenCount");

      var prodMen = await productModel.find().populate({
        path: "category",
        match: {
          category: { $eq: "Men" },
        },
      });
      var MenCount = [];
      prodMen.forEach((elements) => {
        if (elements.category !== null) {
          MenCount.push(elements);
        }
      });

      console.log(MenCount.length, "MenCount");

      var prodKids = await productModel.find().populate({
        path: "category",
        match: {
          category: { $eq: "Kids" },
        },
      });

      var KidsCount = [];
      prodKids.forEach((elements) => {
        if (elements.category !== null) {
          KidsCount.push(elements);
        }
      });

      var prodAccessories = await productModel.find().populate({
        path: "category",
        match: {
          category: { $eq: "Accessories" },
        },
      });

      var AccessoriesCount = [];
      prodAccessories.forEach((elements) => {
        if (elements.category !== null) {
          AccessoriesCount.push(elements);
        }
      });

      var prodCosmetics = await productModel.find().populate({
        path: "category",
        match: {
          category: { $eq: "Cosmetics" },
        },
      });
      var CosmeticsCount = [];
      prodCosmetics.forEach((elements) => {
        if (elements.category !== null) {
          CosmeticsCount.push(elements);
        }
      });

      let TodaySales = TodaySalesT.total;
      let weaklySales = weaklySalesT[0].total;
      let monthlySales = monthlySalesT[0].total;
      var WomenCount = WomenCount.length;
      var AccessoriesCount = AccessoriesCount.length;
      var KidsCount = KidsCount.length;
      var MenCount = MenCount.length;
      var CosmeticsCount = CosmeticsCount.length;

      res.render("admin/adminHome", {
        TodaySales,
        weaklySales,
        monthlySales,
        MenCount,
        WomenCount,
        AccessoriesCount,
        KidsCount,
        CosmeticsCount,
      });
    } else {
      res.redirect("/admin");
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
  Home: async (req, res) => {
    if (req.session.adminLogin) {
      let currentDate = new Date();
      let today = currentDate.getDate();
      let startdate;
      if (today <= 7) {
        startdate = 1;
      } else {
        startdate = today - 7;
      }
      console.log(today, "today");
      console.log(startdate, "start dat");
      let month = currentDate.getMonth();
      console.log(month, "month");
      let year = currentDate.getFullYear();
      console.log(year, "year");


      const TodaySalesT = await orderModule.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(
                new Date(year, month, currentDate).setHours(00, 00, 00)
              ),
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$total" },
          },
        },
      ]);

      const weaklySalesT = await orderModule.aggregate([
        {
          $match: {
            createdAt: {
              $gt: new Date(
                new Date(year, month, startdate).setHours(00, 00, 00)
              ),
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$total" },
          },
        },
      ]);
      const monthlySalesT = await orderModule.aggregate([
        {
          $match: {
            createdAt: {
              $gt: new Date(new Date(year, month, 1).setHours(00, 00, 00)),
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$total" },
          },
        },
      ]);

      var prodWomen = await productModel.find().populate({
        path: "category",
        match: {
          category: { $eq: "Women" },
        },
      });

      var WomenCount = [];
      prodWomen.forEach((elements) => {
        if (elements.category !== null) {
          WomenCount.push(elements);
        }
      });

      var prodMen = await productModel.find().populate({
        path: "category",
        match: {
          category: { $eq: "Men" },
        },
      });
      var MenCount = [];
      prodMen.forEach((elements) => {
        if (elements.category !== null) {
          MenCount.push(elements);
        }
      });

      console.log(MenCount.length, "MenCount");

      var prodKids = await productModel.find().populate({
        path: "category",
        match: {
          category: { $eq: "Kids" },
        },
      });

      var KidsCount = [];
      prodKids.forEach((elements) => {
        if (elements.category !== null) {
          KidsCount.push(elements);
        }
      });

      var prodAccessories = await productModel.find().populate({
        path: "category",
        match: {
          category: { $eq: "Accessories" },
        },
      });

      var AccessoriesCount = [];
      prodAccessories.forEach((elements) => {
        if (elements.category !== null) {
          AccessoriesCount.push(elements);
        }
      });

      var prodCosmetics = await productModel.find().populate({
        path: "category",
        match: {
          category: { $eq: "Cosmetics" },
        },
      });
      var CosmeticsCount = [];
      prodCosmetics.forEach((elements) => {
        if (elements.category !== null) {
          CosmeticsCount.push(elements);
        }
      });

      console.log(monthlySalesT, "monthlySalesmonthlySales");
      let TodaySales = TodaySalesT.total;
      let weaklySales = weaklySalesT[0].total;
      let monthlySales = monthlySalesT[0].total;
      var WomenCount = WomenCount.length;
      var AccessoriesCount = AccessoriesCount.length;
      var KidsCount = KidsCount.length;
      var MenCount = MenCount.length;
      var CosmeticsCount = CosmeticsCount.length;

      res.render("admin/adminHome", {
        TodaySales,
        weaklySales,
        monthlySales,
        MenCount,
        WomenCount,
        AccessoriesCount,
        KidsCount,
        CosmeticsCount,
      });
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
