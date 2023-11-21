const { response } = require("express");
const Product = require("../models/Product");
const base64ToImage = require("image-size");

exports.createProduct = async (req, res) => {
  try {
    let product;

    if (req.body.isImgFile) {
      validateImage(req.body.image);
      console.log("Image has been successfully validated");
    } else {
      await getMimeType(req.body.image)
        .then((res) => {
          console.log("MimeType: ", res);
          validateMimeType(res);
        })
        .catch((err) => {
          throw err;
        });
    }

    product = new Product(req.body);
    await product.save();

    res.send(product);
  } catch (error) {
    res
      .status(500)
      .send(
        error.message || "Something went wrong when trying to add a new product"
      );
  }
};

function validateImage(base64String) {
  try {
    if (!base64String.startsWith("data:image/")) {
      throw new Error("Image format is not allowed");
    }

    const buffer = Buffer.from(base64String.split(",")[1], "base64");
    const dimensions = base64ToImage(buffer);

    if (dimensions.width !== dimensions.height) {
      throw new Error("Image is not a square");
    }
    if (dimensions.width < 400 || dimensions.height < 400) {
      throw new Error("Image size is too small");
    }
  } catch (error) {
    console.warn("error to validate, due to ", error);
    throw error;
  }
}

function getMimeType(url) {
  return fetch(url)
    .then((res) => {
      if (!res.ok)
        throw new Error("Problem while fetching image url, ", res.status);

      const contentType = res.headers.get("Content-Type");
      if (!contentType) throw new Error("No Content-Type availabe");

      return contentType;
    })
    .catch((err) => {
      console.log('fetch error: ', err);
      throw err;
    });
}

function validateMimeType(mime) {
  if (!mime.startsWith("image"))
    throw new Error("The Url provided is not an image");
}
