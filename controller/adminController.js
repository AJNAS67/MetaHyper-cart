const express = require("express");
const bcrypt = require("bcrypt");
const UserModel = require("../model/userModel");
const categoryModel = require("../model/categoryModel");
const adminData = require("../model/adminModel");
const orderModel = require("../model/orderModel");
const productModel = require("../model/productModel");
const moment = require("moment");
const { pieChartDetails } = require("../middleware/pieChart");
const userModel = require("../model/userModel");

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
      const user = await userModel.find();
      let numberOfUser;
      if (user) {
        numberOfUser = user.length;
      } else {
        numberOfUser = 0;
      }

      let currentDate = new Date();
      let today = currentDate.getDate();
      let startdate;

      if (today <= 7) {
        startdate = 1;
      } else {
        startdate = today - 7;
      }
      let month = currentDate.getMonth();
      let year = currentDate.getFullYear();

      let previousYear = year - 1;
      const previousYearSales = await orderModel.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(
                new Date(previousYear, 10, 1).setHours(00, 00, 00)
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
      const currentYearSales = await orderModel.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(new Date(year, 0, 1).setHours(00, 00, 00)),
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

      let pys1;
      let cys;
      if (previousYearSales == "") {
        pys1 = 0;
      } else {
        pys1 = previousYearSales[0].total;
      }

      if (currentYearSales == "") {
        cys = 0;
      } else {
        cys = currentYearSales[0].total;
      }
      let pys = pys1 - cys;

      let sg;
      try {
        if (pys == 0) {
          sg = 100;
        } else {
          sg = ((cys - pys) / pys) * 100;
        }
      } catch (error) {
        sg = 100;
      }

      let salesGrouth = Math.round(sg);
      const TodaySalesT = await orderModel.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(new Date(year, month, today).setHours(00, 00, 00)),
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
      let yesteday = today - 1;
      const YestrdaySalesT = await orderModel.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(
                new Date(year, month, yesteday).setHours(00, 00, 00)
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

      const weaklySalesT = await orderModel.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(
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
      const monthlySalesT = await orderModel.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(new Date(year, month, 1).setHours(00, 00, 00)),
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

      let MenTotalAmount = MenCount.reduce(
        (acc, cur) => acc + cur.quantity * cur.price,
        0
      );
      let WomenTotalAmount = MenCount.reduce(
        (acc, cur) => acc + cur.quantity * cur.price,
        0
      );
      let KidsTotalAmount = MenCount.reduce(
        (acc, cur) => acc + cur.quantity * cur.price,
        0
      );
      let CosmeticsTotalAmount = MenCount.reduce(
        (acc, cur) => acc + cur.quantity * cur.price,
        0
      );

      let MenTotalPrdPrice = MenCount.reduce(
        (acc, cur) => acc + cur.quantity * cur.price,
        0
      );

      let MenTotalProdAvailable = MenCount.reduce(
        (acc, cur) => acc + cur.quantity,
        0
      );
      let KidsTotalProdAvailable = KidsCount.reduce(
        (acc, cur) => acc + cur.quantity,
        0
      );
      let AccessoriesTotalProdAvailable = AccessoriesCount.reduce(
        (acc, cur) => acc + cur.quantity,
        0
      );
      let CosmeticsTotalProdAvailable = CosmeticsCount.reduce(
        (acc, cur) => acc + cur.quantity,
        0
      );
      let WomenCountTotalProdAvailable = WomenCount.reduce(
        (acc, cur) => acc + cur.quantity,
        0
      );
      let TotalProdAvailable =
        MenTotalProdAvailable +
        KidsTotalProdAvailable +
        AccessoriesTotalProdAvailable +
        CosmeticsTotalProdAvailable +
        WomenCountTotalProdAvailable;

      let weaklySales;
      let TodaySales;
      let monthlySales;
      let YestrdaySales;
      if (weaklySalesT == "") {
        weaklySales = 0;
      } else {
        weaklySales = weaklySalesT[0].total;
      }
      if (TodaySalesT == "") {
        TodaySales = 0;
      } else {
        TodaySales = TodaySalesT[0].total;
      }
      if (YestrdaySalesT == "") {
        YestrdaySales = 0;
      } else {
        YestrdaySales = YestrdaySalesT[0].total;
      }
      if (monthlySalesT == "") {
        monthlySales = 0;
      } else {
        monthlySales = monthlySalesT[0].total;
      }

      let daysGrouthPercentage;
      if (YestrdaySales != 0) {
        daysGrouthPercentage = Math.round(
          ((TodaySales - YestrdaySales) / YestrdaySales) * 100
        );
      } else {
        daysGrouthPercentage = 100;
      }
      let daysGrouth;
      if (TodaySales - YestrdaySales >= 0) {
        daysGrouth = true;
      } else {
        daysGrouth = false;
      }

      var WomenCount = WomenCount.length;
      var AccessoriesCount = AccessoriesCount.length;
      var KidsCount = KidsCount.length;
      var MenCount = MenCount.length;
      var CosmeticsCount = CosmeticsCount.length;
      let test = [1, 2, 3, 4];
      const allData = await pieChartDetails();
      let monthlySale;
      if (allData[5] == 0) {
        monthlySale = 100;
      } else {
        monthlySale = ((allData[6] - allData[5]) / allData[5]) * 100;
      }
      let MonthlySalesGrouth = Math.round(monthlySale);
      let monthInc;
      if (allData[6] - allData[5] >= 0) {
        monthInc = true;
      } else {
        monthInc = false;
      }
      const onlinePayment_transaction = await orderModel.aggregate([
        {
          $match: {
            paymentMethod: "Online Payment",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$total" },
          },
        },
      ]);

      const cash_on_delivery_transaction = await orderModel.aggregate([
        {
          $match: {
            paymentMethod: "Cash On Delivery",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$total" },
          },
        },
      ]);
      const wallet_transaction = await orderModel.aggregate([
        {
          $match: {
            paymentMethod: "Wallet",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$total" },
          },
        },
      ]);

      res.render("admin/adminHome", {
        TodaySales,
        weaklySales,
        monthlySales,
        MenCount,
        WomenCount,
        AccessoriesCount,
        KidsCount,
        CosmeticsCount,
        pys,
        cys,
        salesGrouth,
        previousYear,
        year,
        MenTotalProdAvailable,
        KidsTotalProdAvailable,
        AccessoriesTotalProdAvailable,
        CosmeticsTotalProdAvailable,
        WomenCountTotalProdAvailable,
        MenTotalAmount,
        WomenTotalAmount,
        KidsTotalAmount,
        CosmeticsTotalAmount,
        test,
        allData,
        TotalProdAvailable,
        numberOfUser,
        MonthlySalesGrouth,
        monthInc,
        daysGrouthPercentage,
        daysGrouth,
        wallet_transaction,
        cash_on_delivery_transaction,
        onlinePayment_transaction,
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
      const user = await userModel.find();
      let numberOfUser;
      if (user) {
        numberOfUser = user.length;
      } else {
        numberOfUser = 0;
      }
      let currentDate = new Date();
      let today = currentDate.getDate();
      let startdate;
      if (today <= 7) {
        startdate = 1;
      } else {
        startdate = today - 7;
      }
      let month = currentDate.getMonth();
      let year = currentDate.getFullYear();

      let previousYear = year - 1;
      const previousYearSales = await orderModel.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(
                new Date(previousYear, 10, 1).setHours(00, 00, 00)
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
      const currentYearSales = await orderModel.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(new Date(year, 0, 1).setHours(00, 00, 00)),
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

      const TodaySalesT = await orderModel.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(new Date(year, month, today).setHours(00, 00, 00)),
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
      let yesteday = today - 1;
      const YestrdaySalesT = await orderModel.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(
                new Date(year, month, yesteday).setHours(00, 00, 00)
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

      const weaklySalesT = await orderModel.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(
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
      const monthlySalesT = await orderModel.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(new Date(year, month, 1).setHours(00, 00, 00)),
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

      let MenTotalAmount = MenCount.reduce(
        (acc, cur) => acc + cur.quantity * cur.price,
        0
      );
      let WomenTotalAmount = MenCount.reduce(
        (acc, cur) => acc + cur.quantity * cur.price,
        0
      );
      let KidsTotalAmount = MenCount.reduce(
        (acc, cur) => acc + cur.quantity * cur.price,
        0
      );
      let CosmeticsTotalAmount = MenCount.reduce(
        (acc, cur) => acc + cur.quantity * cur.price,
        0
      );

      let MenTotalPrdPrice = MenCount.reduce(
        (acc, cur) => acc + cur.quantity * cur.price,
        0
      );

      let MenTotalProdAvailable = MenCount.reduce(
        (acc, cur) => acc + cur.quantity,
        0
      );
      let KidsTotalProdAvailable = KidsCount.reduce(
        (acc, cur) => acc + cur.quantity,
        0
      );
      let AccessoriesTotalProdAvailable = AccessoriesCount.reduce(
        (acc, cur) => acc + cur.quantity,
        0
      );
      let CosmeticsTotalProdAvailable = CosmeticsCount.reduce(
        (acc, cur) => acc + cur.quantity,
        0
      );
      let WomenCountTotalProdAvailable = WomenCount.reduce(
        (acc, cur) => acc + cur.quantity,
        0
      );

      let MenTotalSales = MenCount.reduce((acc, cur) => acc + cur.quantity, 0);

      let weaklySales;
      let TodaySales;
      let monthlySales;
      let YestrdaySales;
      if (weaklySalesT == "") {
        weaklySales = 0;
      } else {
        weaklySales = weaklySalesT[0].total;
      }
      if (TodaySalesT == "") {
        TodaySales = 0;
      } else {
        TodaySales = TodaySalesT[0].total;
      }
      if (YestrdaySalesT == "") {
        YestrdaySales = 0;
      } else {
        YestrdaySales = YestrdaySalesT[0].total;
      }
      if (monthlySalesT == "") {
        monthlySales = 0;
      } else {
        monthlySales = monthlySalesT[0].total;
      }
      let pys1;
      let cys;
      let sg;

      if (previousYearSales == "") {
        pys1 = 0;
      } else {
        pys1 = previousYearSales[0].total;
      }
      if (currentYearSales == "") {
        cys = 0;
      } else {
        cys = currentYearSales[0].total;
      }

      let pys = pys1 - cys;

      try {
        if (pys == 0) {
          sg = 100;
        } else {
          sg = ((cys - pys) / pys) * 100;
        }
      } catch (error) {
        sg = 100;
      }

      let salesGrouth = Math.round(sg);

      var WomenCount = WomenCount.length;
      var AccessoriesCount = AccessoriesCount.length;
      var KidsCount = KidsCount.length;
      var MenCount = MenCount.length;
      var CosmeticsCount = CosmeticsCount.length;
      let test = [1, 2, 3, 4];
      const allData = await pieChartDetails();

      let TotalProdAvailable =
        MenTotalProdAvailable +
        KidsTotalProdAvailable +
        AccessoriesTotalProdAvailable +
        CosmeticsTotalProdAvailable +
        WomenCountTotalProdAvailable;
      let daysGrouthPercentage;
      if (YestrdaySales != 0) {
        daysGrouthPercentage = Math.round(
          ((TodaySales - YestrdaySales) / YestrdaySales) * 100
        );
      } else {
        daysGrouthPercentage = 100;
      }
      let daysGrouth;
      if (TodaySales - YestrdaySales >= 0) {
        daysGrouth = true;
      } else {
        daysGrouth = false;
      }

      let monthlySale;
      if (allData[5] == 0) {
        monthlySale = 100;
      } else {
        monthlySale = ((allData[6] - allData[5]) / allData[5]) * 100;
      }
      let MonthlySalesGrouth = Math.round(monthlySale);

      let monthInc;
      if (allData[6] - allData[5] >= 0) {
        monthInc = true;
      } else {
        monthInc = false;
      }
      const onlinePayment_transaction = await orderModel.aggregate([
        {
          $match: {
            paymentMethod: "Online Payment",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$total" },
          },
        },
      ]);

      const cash_on_delivery_transaction = await orderModel.aggregate([
        {
          $match: {
            paymentMethod: "Cash On Delivery",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$total" },
          },
        },
      ]);
      const wallet_transaction = await orderModel.aggregate([
        {
          $match: {
            paymentMethod: "Wallet",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$total" },
          },
        },
      ]);

      res.render("admin/adminHome", {
        TodaySales,
        weaklySales,
        monthlySales,
        MenCount,
        WomenCount,
        AccessoriesCount,
        KidsCount,
        CosmeticsCount,
        pys,
        cys,
        salesGrouth,
        year,
        previousYear,
        MenTotalProdAvailable,
        KidsTotalProdAvailable,
        KidsTotalProdAvailable,
        AccessoriesTotalProdAvailable,
        CosmeticsTotalProdAvailable,
        WomenCountTotalProdAvailable,
        MenTotalAmount,
        WomenTotalAmount,
        KidsTotalAmount,
        CosmeticsTotalAmount,
        test,
        allData,
        TotalProdAvailable,
        numberOfUser,
        MonthlySalesGrouth,
        monthInc,
        daysGrouthPercentage,
        daysGrouth,
        wallet_transaction,
        cash_on_delivery_transaction,
        onlinePayment_transaction,
      });
    } else {
      res.redirect("/admin/adminlog");
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
  viewOrderDetails: async (req, res) => {
    let orderId = req.query.id;
    let orders = await orderModel.findById(orderId);
    res.render("admin/viewOrder", { orders });
  },
  salesReport: async (req, res) => {
    let orders;
    let total;
    let sort = req.query;
    if (sort.no == 1) {
      const today = moment().startOf("day");

      orders = await orderModel.find({
        orderStatus: "Delivered",
        createdAt: {
          $gte: today.toDate(),
          $lte: moment(today).endOf("day").toDate(),
        },
      });
      total = orders.reduce((acc, cur) => acc + cur.total, 0);
    } else if (sort.no == 2) {
      const month = moment().startOf("month");
      orders = await orderModel.find({
        orderStatus: "Delivered",
        createdAt: {
          $gte: month.toDate(),
          $lte: moment(month).endOf("month").toDate(),
        },
      });
      total = orders.reduce((acc, cur) => acc + cur.total, 0);
    } else if (sort.no == 3) {
      const year = moment().startOf("year");
      orders = await orderModel.find({
        orderStatus: "Delivered",
        createdAt: {
          $gte: year.toDate(),
          $lte: moment(year).endOf("year").toDate(),
        },
      });
      total = orders.reduce((acc, cur) => acc + cur.total, 0);
    } else {
      orders = await orderModel.find();
      total = orders.reduce((acc, cur) => acc + cur.total, 0);
    }

    res.render("admin/salesReport", { orders, total, number: req.query.no });
  },
  adminLogout: (req, res) => {
    req.session.adminLogin = false;
    res.redirect("/admin");
  },
};
