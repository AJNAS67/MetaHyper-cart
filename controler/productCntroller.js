const ProductModel = require("../model/product");
const CategoryModel = require("../model/category");

module.exports = {
  //add products
  doAddProduct: async (req, res) => {
    console.log(req.body, "product");
    const { name, quantity, price, discount, category, description, brand ,images} =
      req.body;
    console.log(category, "req.body;");
    console.log(brand, "brand");
    // const image = req.file;
    // console.log(image);
    const image = req.body.images

    // for (file of req.files) {
    //   image.push(file.filename);
    // }
    console.log(image,'image');

    const newProduct = ProductModel({
      name,
      quantity,
      price,
      discount,
      category,
      description,
      brand,
      images
    });
    console.log(newProduct, "newProduct");

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
    let id = req.params.id;
    await ProductModel.findByIdAndDelete({ _id: id });
    res.redirect("/admin/adminProducts");
  },

  // Update Product
  updateProduct: async (req, res) => {
    console.log(req.body, "upadate");
    const { name, quantity, price, discount, category, description, brand } =
      req.body;
    if (req.file) {
      let image = req.file;
      await ProductModel.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: { image: image.filename } }
      );
    }
    let details = await ProductModel.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          name,
          quantity,
          price,
          discount,
          category,
          description,
          brand,
        },
      }
    );
    await details.save().then(() => {
      res.redirect("/admin/adminProducts");
    });

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
    const id = req.params.id;
    let category = await CategoryModel.find();

    let product = await ProductModel.findById({ _id: id }).populate("category");
    console.log(category, "category");

    console.log(product, "prod");

    res.render("admin/edit-product", { product, category: category });
    // } else {
    //   res.redirect("/admin");
    // }
  },
  addCategory: async (req, res) => {
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
        console.log(err, "category didint ad");
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
};
