const Product = require("../models/Product");
const imgLogic = require("../utils/imgLogic");
const authLogic = require("../utils/authLogic");
const run = require("../config/mongodb");
const { ObjectId } = require("mongodb");

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    products.forEach((element) => {
      if (element.image.startsWith("img"))
        element.image = `http://localhost:3000/img/${element.image}`;
      //element.image = imgLogic.loadImageFile(element);
    });

    res.json(products);
  } catch (error) {
    console.warn(
      "Something went wrong while fetching all products from database ->",
      error
    );
    res
      .status(500)
      .send(
        error.message ||
          "Something went wrong when trying to fetch all products"
      );
  }
};

exports.createProduct = async (req, res) => {
  try {
    if (await authLogic.checkRBAC(req, ["Admin", "Employee"])) {
      let product = new Product(req.body);
      console.log("product info - creating... ->", product);
      product.image = await imgLogic.manageImage(req);

      await product.save();

      res.status(201).json({ msg: "The product was successfully added" });
    } else {
      res
        .status(403)
        .json({ msg: "The product could not be added due to permissions" });
    }
  } catch (error) {
    console.log("Problem while creating -> ", error);
    res
      .status(500)
      .send(
        error.message || "Something went wrong when trying to add a new product"
      );
  }
};

exports.updateProduct = async (req, res) => {
  try {
    if (await authLogic.checkRBAC(req, ["Admin", "Employee"])) {
      req.body.image = await imgLogic.manageImage(req);

      const query = await Product.findOneAndUpdate(
        { _id: req.params.id },
        req.body
      );

      //?? otra forma de actuazliar vía mongoose:
      /*const query = await Product.updateOne(
      { _id: req.params.id },
      req.body
      ).exec();
      
      if (query.matchedCount === 0) res.status(404);*/

      if (!query) res.status(404).json({ msg: "The product does not exist" });
      else {
        imgLogic.deleteImage(query.image);
        res
          .status(202)
          .json({ msg: "The product was successfully updated" }, query);
      }
    } else {
      res
        .status(403)
        .json({ msg: "The product could not be updated due to permissions" });
    }
  } catch (error) {
    console.log("Problem while updating -> ", error);
    res.status(500).send("Internal server error while updating");
  }
};

//?? mongoose delete
exports.deleteProduct = async (req, res) => {
  try {
    if (await authLogic.checkRBAC(req, ["Admin", "Employee"])) {
      const query = await Product.findOneAndDelete({ _id: req.params.id });

      if (!query) res.status(404).json({ msg: "The product does not exist" });
      else {
        imgLogic.deleteImage(query.image);
        res.status(202).json({ msg: "The product was successfully deleted", success: true });
      }
    } else {
      res
        .status(403)
        .json({ msg: "The product could not be deleted due to permissions", success: false });
    }
  } catch (error) {
    console.log("Problem while deleting -> ", error);
    res.status(500).json({ msg: "The product could not be deleted due to permissions", success: false });
  }
};

//?? mongoDB delete with BULKWRITE
/* exports.deleteProduct = async (req, res) => {
  const { coll, client } = run("shop", "products");

  try {
    if (await authLogic.checkRBAC(req, ["Admin", "Employee"])) {
      const imgQuery = await coll.findOne(
        { _id: new ObjectId(req.params.id) },
        { projection: { _id: 0, image: 1 } }
      );

      const query = await coll.bulkWrite([
        { deleteOne: { filter: { _id: new ObjectId(req.params.id) } } },
      ]);

      if (query.deletedCount === 0)
        res
          .status(404)
          .json({ msg: "The product does not exist", success: false });
      else {
        console.log("Deleted Count -> ", query.deletedCount);
        imgLogic.deleteImage(imgQuery.image);
        res
          .status(202)
          .json({ msg: "The product was successfully deleted", success: true });
      }
    } else {
      res.status(403).json({
        msg: "The product could not be deleted due to permissions",
        success: false,
      });
    }
  } catch (error) {
    console.log("Problem while deleting -> ", error);
    res.status(500).send("Internal server error while deleting");
  } finally {
    await client.close();
  }
};
 */