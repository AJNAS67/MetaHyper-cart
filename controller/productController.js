const ProductModel = require("../model/productModel");
const CategoryModel = require("../model/categoryModel");
const orderModel = require("../model/orderModel");
var fs = require("fs");

module.exports = {
  //add products
  doAddProduct: async (req, res) => {
    console.log(req.body, "product");
    const {
      name,
      quantity,
      price,
      discount,
      category,
      description,
      brand,
      images,
    } = req.body;

    const image = req.body.images;

    // for (file of req.files) {
    //   image.push(file.filename);
    // }
    console.log(image, "image");

    const newProduct = ProductModel({
      name,
      quantity,
      price,
      discount,
      category,
      description,
      brand,
      image,
    });

    await newProduct
      .save()
      .then(() => {
        res.redirect("/admin/addproducts");
      })
      .catch((err) => {
        console.log(err.message);
        res.redirect("/admin/addproducts");
      });
  },
  viewProduct: async (req, res) => {
    const product = await ProductModel.find({});

    res.render("admin/viewproducts", { products: product });
  },

  // UnBlock Car
  unblockDress: async (req, res) => {
    const id = req.params.id;
    await ProductModel.findByIdAndUpdate(
      { _id: id },
      { $set: { status: "Unblocked" } }
    ).then(() => {
      res.redirect("/admin/adminProducts");
    });
  },

  // Block car
  blockDress: async (req, res) => {
    const id = req.params.id;
    await ProductModel.findByIdAndUpdate(
      { _id: id },
      { $set: { status: "Blocked" } }
    ).then(() => {
      res.redirect("/admin/adminProducts");
    });
  },

  // Delete Product
  deleteproduct: async (req, res) => {
    // let proId = req.params.id;
    // await ProductModel.findByIdAndDelete({ _id: id });
    // res.redirect("/admin/adminProducts");

    try {
      let proId = req.params.id;

      ProductModel.deleteOne({ _id: proId }).then(() => {
        res.json({ status: true });
      });
    } catch (error) {
      res.json({ status: false });
      app.use((req, res) => {
        res.status(429).render("admin/error-429");
      });
    }
  },

  // Update Product
  updateProduct: async (req, res) => {
    let id = req.query.id;

    try {
      // let id = req.params.id;
      const product = await ProductModel.findById({ _id: id });
      console.log(product, "product");
      if (req.body.images == "") {
        const productDetails = await ProductModel.findByIdAndUpdate(
          { _id: id },
          {
            $set: {
              name: req.body.name,
              quantity: req.body.quantity,
              price: req.body.price,
              discount: req.body.discount,
              category: req.body.category,
              description: req.body.description,
              brand: req.body.brand,
            },
          }
        );
        await productDetails.save().then(() => {
          res.redirect("/admin/adminProducts");
        });
      } else {
        const productImage = product.image;
        for (let i = 0; i < productImage.length; i++) {
          const imgPath = productImage[i];
          console.log(
            `/public/images/productImages/" + ${imgPath}`,
            "img paaaaaaaaaaaaaaath"
          );

          fs.unlink("./public/images/productImages/" + imgPath, () => {});
        }

        const productDetails = await ProductModel.findByIdAndUpdate(
          { _id: id },
          {
            $set: {
              name: req.body.name,
              quantity: req.body.quantity,
              price: req.body.price,
              discount: req.body.discount,
              category: req.body.category,
              description: req.body.description,
              brand: req.body.brand,
              image: req.body.images,
            },
          }
        );
        await productDetails.save().then(() => {
          res.redirect("/admin/adminProducts");
        });
      }
      res.redirect("/admin/adminProducts");
    } catch (error) {
      // res.redirect("/admin");
      console.log(error.message, "message from update prod");
    }

    // const { name, quantity, price, discount, category, description, brand } =
    //   req.body;
    // if (req.body.images) {
    //   console.log(req.body, "req.body.images");
    // }
    // if (req.body.image) {
    //   let image = req.body.image;
    //   await ProductModel.findByIdAndUpdate(
    //     { _id: req.params.id },
    //     { $set: { image: image } }
    //   );
    // }
    // let details = await ProductModel.findByIdAndUpdate(
    //   { _id: req.params.id },
    //   {
    //     $set: {
    //       name,
    //       quantity,
    //       price,
    //       discount,
    //       category,
    //       description,
    //       brand,
    //     },
    //   }
    // );
    // await details.save().then(() => {
    //   res.redirect("/admin/adminProducts");
    // });

    // const { type, brand, fuelType, productName, discription, price } = req.body;
    // if (req.file) {
    //   let image = req.file;
    //   await ProductModel.findByIdAndUpdate(
    //     { _id: req.params.id },
    //     { $set: { image: image.filename } }
    //   );
    // }
    // let details = await ProductModel.findOneAndUpdate(
    //   { _id: req.params.id },
    //   { $set: { type, brand, fuelType, productName, discription, price } }
    // );
    // await details.save().then(() => {
    //   res.redirect("/admin/adminProducts");
    // });
  },
  //edit product page
  editproductpage: async (req, res) => {
    // if (req.session.adminLogin) {
    const { Id } = req.params;
    let category = await CategoryModel.find();

    let product = await ProductModel.findById({ _id: Id }).populate("category");
    res.render("admin/edit-product", { product, category: category });
    // } else {
    //   res.redirect("/admin");
    // }
  },
  addCategory: async (req, res) => {
    console.log(req.body, "cat");
    const category = req.body.category;
    const newCategory = CategoryModel({
      category,
    });
    await newCategory
      .save()
      .then(() => {
        res.redirect("/admin/viewcategory");
        console.log("catogory added succesfully");
      })
      .catch((err) => {
        console.log(err.message, "category didint ad");
        res.redirect("/admin/viewcategory");
      });
  },
  addCategory1: (eq, res) => {
    res.render("admin/addcategory");
  },

  doDeleteCategory: async (req, res) => {
    console.log(req.body);
    let id = req.params.id;
    await CategoryModel.findByIdAndDelete({ _id: id });
    res.redirect("/admin/viewcategory");
  },
  viewOrder: async (req, res) => {
    let order = await orderModel.find().sort({ Date: -1 });
    res.render("admin/oders", { result: order });
  },

  changeTrack: async (req, res) => {
    try {
      oid = req.body.oid;
      value = req.body.value;

      console.log(oid, value, "lllll");

      if (value == "Delivered") {
        await orderModel
          .updateOne(
            {
              _id: oid,
            },
            {
              $set: {
                track: value,
                orderStatus: value,
                paymentStatus: "Payment Completed",
              },
            }
          )
          .then((res) => {
            console.log(res);
          });
      } else {
        await orderModel
          .updateOne(
            {
              _id: oid,
            },
            {
              $set: {
                track: value,
                orderStatus: value,
              },
            }
          )
          .then((res) => {
            console.log(res);
          });
      }
    } catch (error) {
      app.use((req, res) => {
        res.status(429).render("admin/error-429");
      });
    }
  },
};
