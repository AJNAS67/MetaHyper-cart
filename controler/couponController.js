const couponModule = require("../model/couponModal");
const moment = require("moment");
const User = require("../model/userModel");
const cartModel = require("../model/cart");
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

      res.render("admin/coupons", { Coupon: null });
    } catch (error) {
      console.log(error.message, "mesage from view coupen");
      res.render("admin/coupons", { Coupon: null });
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
      console.log(id, "ididid");
      await couponModule.deleteOne({ _id: id }).then((rs) => {
        console.log(rs, "rssssssssssss");
      });
    } catch (error) {
      console.log(error.message);
      // res.redirect("/admin_404");
      console.log(error.message);
    }
  },
  // checkCoupon: (req, res) => {
  //   console.log(req.body,'req.body');
  //   res.send('hi')
  // },
  couponVerify: async (req, res) => {
    console.log(req.body, "hhhhhhhhhhhhhhhhhhhh");

    try {
      const CoupenCode = req.body.coupon;
      const amoutTotal = req.body.amountTotal;
      let userId = req.session.userId;
      const user = await User.findById(userId);
      console.log(user, "useruser");
      console.log(CoupenCode, "CoupenCode");
      console.log(amoutTotal, "amoutTotal");
      let coupon = await couponModule.findOne({ couponCode: CoupenCode });
      // let coupon = await couponModule.find();

      let date = new Date();
      console.log(coupon, "coupon");
      if (user.applyCoupon) {
        console.log("have copen");
        await User.updateOne(
          { _id: userId },
          {
            $set: {
              applyCoupon: false,
            },
          }
        ).then((rss) => {
          console.log(rss, "rss");
        });
        await User.updateOne(
          { _id: userId },
          {
            $pull: {
              usedCoupon: {
                couponId: coupon._id,
                code: coupon.couponCode,
              },
            },
          }
        ).then((e) => {
          console.log(e, "eeeeeeee");
        });
        res.json({ removeCoupon: true });
        console.log(user.applyCoupon, "applaycopon");
      } else {
        if (CoupenCode == "") {
          res.json(false);
        } else {
          let existCoupon = await User.findOne({
            _id: userId,
            "usedCoupon.couponId": coupon._id,
          });
          console.log(existCoupon, "existCouponexistCoupon");
          if (existCoupon) {
            res.json({ exist: true });
          } else {
            if (coupon) {
              let percentage = coupon.percentage;
              if (coupon.startDate <= date <= coupon.expiryDate) {
                if (coupon.minCartAmount <= amoutTotal) {
                  discount = (amoutTotal * percentage) / 100;

                  if (coupon.maxRadeemAmount >= discount) {
                    let totalLast = amoutTotal - discount;
                    await cartModel.updateOne(
                      { userId: userId },
                      {
                        $set: { subTotal: totalLast, couponDiscount: discount },
                      }
                    );
                    await User.updateOne(
                      { _id: userId },
                      {
                        $set: {
                          applyCoupon: true,
                        },
                      }
                    );
                    await User.updateOne(
                      { _id: userId },
                      {
                        $push: {
                          usedCoupon: {
                            couponId: coupon._id,
                            code: coupon.couponCode,
                          },
                        },
                      }
                    );
                    res.json({ success: true });
                  } else {
                    res.json({ maxRadeem: coupon.maxRadeemAmount });
                  }
                } else {
                  res.json({ minCart: coupon.minCartAmount });
                }
              } else {
                res.json({ expired: true });
              }
            } else {
              res.json({ invalid: true });
            }
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  },
};
