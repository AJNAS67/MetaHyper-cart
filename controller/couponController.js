const couponModule = require("../model/couponModel");
const moment = require("moment");
const User = require("../model/userModel");
const cartModel = require("../model/cartModel");
const { cartAndWishlstNum } = require("../middleware/cart-wishlist-number");

module.exports = {
  adminCoupon: async (req, res) => {
    try {
      const Coupon = await couponModule.find();
      let date = new Date();
      for (let i = 0; i < Coupon.length; i++) {
        if (date > Coupon[i].expiryDate) {
          let id = Coupon[i]._id;
          await couponModule.deleteOne({ _id: id }).then((rs) => {
          });
          // await Coupon.deleteOne({ _id: id }).then((del) => {
          //   console.log(del, "de;leted");
          // });
        } else {
          const testDate = Coupon[i].expiryDate;
          Coupon[i].date = moment(testDate).format("DD MMMM , YYYY");
        }
      }

      res.render("admin/coupons", { Coupon });
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
      res.redirect('/admin/')
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
    try {
      const CoupenCode = req.body.coupon;
      const amoutTotal = req.body.amountTotal;
      const cartId = req.body.cartId;
      let userId = req.session.userId;
      const user = await User.findById(userId);
      console.log(CoupenCode, "CoupenCode");
      console.log(amoutTotal, "amoutTotal");
      let coupon = await couponModule.findOne({ couponCode: CoupenCode });
      // let coupon = await couponModule.find();
      let crt = await cartModel.findById(cartId);
      let cartTotal = crt.total;
      let subTotal = cartTotal;
      console.log(crt, "crtcrt");
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
        await cartModel
          .updateOne(
            { _id: cartId },
            { $set: { couponDiscount: 0, subTotal: subTotal } }
          )
          .then((r) => {
            console.log(r, "upadated copen discout");
          });
        res.json({ removeCoupon: true });
        console.log(user.applyCoupon, "applaycopon");
      } else {
        if (CoupenCode == "") {
          res.json(false);
        } else {
          if (!coupon) {
            res.json({ invalid: true });
          }
          console.log("problom");
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
  myCoupons:async(req,res)=>{
    try {
      let userId = req.session.userId;
    const cartAndWishlist = await cartAndWishlstNum(userId);
      let user=req.session.user;
      const coupons=await couponModule.find()
      const formattedOrders = coupons.map((el) => {
        let newEl = { ...el._doc };
        newEl.expiryDate = moment(newEl.expiryDate).format("DD MMMM , YYYY");
        return newEl;
      });
      res.render('user/my-coupon',{user,login:true,coupons:formattedOrders,cartAndWishlist})

      
    } catch (error) {
      res.redirect('/')
      
    }
   
  }
};
