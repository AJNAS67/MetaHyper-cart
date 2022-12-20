const couponModule = require("../model/couponModal");
const moment = require("moment");
module.exports = {
  adminCoupon: async (req, res) => {
    try {
      const Coupon = await couponModule.find();
      let date = new Date();
      for (let i = 0; i < Coupon.length; i++) {
        console.log();
        if (date > Coupon[i].expiryDate) {
          let id = Coupon[i]._id;
          await Coupon.deleteOne({ _id: id }).then((del) => {
            console.log(del, "de;leted");
          });
        } else {
          const testDate = Coupon[i].expiryDate;
          Coupon[i].date = moment(testDate).format("DD MMMM , YYYY");
        }
        res.render("admin/coupons", { Coupon });
      }

      res.render("admin/coupons", { Coupon:null });

    } catch (error) {
      console.log(error.message, "mesage from view coupen");
      res.render("admin/coupons", { Coupon:null });

    }
  },
  addCoupon: async (req, res) => {
    try {
      await couponModule.create(req.body);
      res.redirect("/admin/admin_coupon");
    } catch (error) {
      console.log(error.message, "coupion error");
      // res.redirect('/admin/')
    }
  },
  deleteCoupon: async (req, res) => {
    try {
      const { id } = req.query;
      console.log(id,'ididid');
      await couponModule.deleteOne({ _id: id }).then((rs)=>{
        console.log(rs,'rssssssssssss');
      })
    } catch (error) {
      console.log(error.message);
      // res.redirect("/admin_404");
      console.log(error.message);
    }
  },
};
