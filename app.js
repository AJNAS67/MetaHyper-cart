const createEror = require("http-errors");
const express = require("express");
const path = require("path");
const logger = require("morgan");
// const mongoose = require("mongoose");
require("dotenv").config();

const session = require("express-session");
const cookieParser = require("cookie-parser");
const mongoose = require("./configuration/connection");
const multer = require("multer");
const nocache = require("nocache");

const flash = require("express-flash");
var bodyParser = require("body-parser");

const User = require("./model/userModel");
// InitializePassport(passport, (email) =>
//   User.find((user) => user.email == email)
// );
// InitializePassport(passport);

// const ejsLint = require('ejs-lint');
// mongoose.connect(
//   process.env.MONGOLAB_URI,
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   },
//   () => {
//     console.log("Mogodb is connected");
//   },
//   (e) => console.error(e, "errrrrr")
// );

const usersRouter = require("./routes/users");
const adminRouter = require("./routes/admin");

const app = express();
const router = express.Router();

app.set("views", path.join(__dirname, "views"));

app.set("view engine", "ejs");
app.use(logger("dev"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cookieParser());
app.use(nocache());
app.use(flash());


// Multer (file upload setup)
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/images/dress/");
//   },
//   filename: (req, file, cb) => {
//     cb(
//       null,
//       file.fieldname + "_" + Date.now() + path.extname(file.originalname)
//     );
//     console.log(file.fieldname + Date.now() + path.extname(file.originalname));
//   },
// });
// app.use(multer({ storage: storage }).single("image"));
const oneday = 1000 * 60 * 60 * 24;
app.use(flash());
app.use(
  session({
    secret: "secret-key",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: oneday },
    // store:sessionStorage
  })
);
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },
  })
);

app.use(flash());

app.use(function (req, res, next) {
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  next();
});
// app.use(passport.initialize());

// app.use((req,res,next)=>{
//   if(req.isAuthenticated()){
//     res.locals.user = true
//     res.locals.username = req.user.user_name
//     res.locals.userId = req.user.id
//   }
//   next()
// })

app.use(bodyParser.json());

app.use("/", usersRouter);
app.use("/admin", adminRouter);

const PORT = process.env.PORT;
console.log(PORT,'port');
app.listen(PORT, console.log("Server don start for port: " + PORT));
