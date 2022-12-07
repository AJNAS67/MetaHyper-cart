const bcrypt = require("bcryptjs");
// LocalStrategy = require("passport-local").Strategy;
//Load model
// const User = require("../model/userModel");



// const initialize = (passport) => {
//   passport.use(
//     new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
//       //Check customer
//       User.findOne({ email: email })
//         .then((user) => {
//           if (!user) {
//             console.log("wrong email");
//             return done(null, false, { message: "No user with that email" });
//           }
//           //Match Password
//           bcrypt.compare(password, user.password, (error, isMatch) => {
//             if (error) throw error;
//             if (isMatch) {
//               console.log('logened');
//               return done(null, user);
//             } else {
//               console.log("Wrong password");
//               return done(null, false, { message: "wrong password" });
//             }
//           });
//         })
//         .catch((error) => console.log(error));
//     })
//   );
//   passport.serializeUser((user, done) => {
//     done(null, user.id);
//   });
//   passport.deserializeUser((id, done) => {
//     User.findById(id, (error, user) => {
//       done(error, user);
//     });
//   });
// };
// module.exports = initialize;
