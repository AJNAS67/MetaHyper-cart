const flash = require("connect-flash");

// module.exports = {
//     ensureAuthenticated: function(req, res, next) {
//       if (req.isAuthenticated()) {
//         return next();
//       }
//       req.flash('error_msg', 'Please log in to view that resource');
//       res.redirect('/users/login');
//     },
//     forwardAuthenticated: function(req, res, next) {
//       if (!req.isAuthenticated()) {
//         return next();
//       }
//       res.redirect('/dashboard');
//     }
//   };
module.exports = {
  sessionchek: (req, res, next) => {
    if (req.session.userLogin) {
      next();
    } else {
      //   res.redirect('/login');
      res.render("user/womens", { login: false });
    }
  },
  sessionchekDirectLogin: (req, res, next) => {
    if (req.session.userLogin) {
      next();
    } else {
      const loginError = req.flash("user");

      res.render("user/userlogin", { login: false, loginError });
    }
  },
};
