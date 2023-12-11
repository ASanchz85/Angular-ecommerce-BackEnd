const base64ToImage = require("image-size");
const fs = require("fs");
const path = require("path");

function manageFilePath(fileName) {
  return path.join(path.resolve(__dirname, ".."), "img", fileName);
}

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

async function getMimeType(url) {
  return fetch(url)
    .then((res) => {
      if (!res.ok)
        throw new Error("Problem while fetching image url, ", res.status);

      const contentType = res.headers.get("Content-Type");
      if (!contentType) throw new Error("No Content-Type availabe");

      return contentType;
    })
    .catch((err) => {
      console.warn("fetch error: ", err);
      throw err;
    });
}

function validateMimeType(mime) {
  if (!mime.startsWith("image"))
    throw new Error("The Url provided is not an image");
}

function saveImageFile(req) {
  const base64String = req.body.image;
  const buffer = Buffer.from(base64String.split(",")[1], "base64");
  const fileType = base64String.split(";")[0].split("/")[1];
  const imgName = `img${Date.now()}.${fileType}`;

  fs.writeFile(manageFilePath(imgName), buffer, (err) => {
    if (err) {
      let errorMsg =
        "An error while saving the image to the local file system took place -> ";
      console.warn(errorMsg, err);
      throw new Error(errorMsg);
    } else {
      console.log("Image was successfully saved");
    }
  });

  return imgName;
}

function loadImageFile(product) {
  try {
    const fileType = product.image.split(".")[1];
    const filePath = manageFilePath(product.image);
    const img = fs.readFileSync(filePath);
    const imgToBase64 = Buffer.from(img).toString("base64");

    return `data:image/${fileType};base64,${imgToBase64}`;
  } catch (error) {
    //!! mirar como subir imagen desde disco
    console.warn("error while loading from file system", error);
    return "http://localhost:3000/img/No_image.png";
  }
}

async function manageImage(req) {
  if (req.body.isImgFile) {
    validateImage(req.body.image);
    console.log("Image has been successfully validated");
    return saveImageFile(req);
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
}

function deleteImage(fileToDelete) {
  if (
    fs.existsSync(manageFilePath(fileToDelete)) &&
    fileToDelete.startsWith("img")
  ) {
    fs.rm(manageFilePath(fileToDelete), (err) => {
      if (err) throw new Error("Error while deleting ");
    });
  }
}

module.exports = {
  saveImageFile,
  loadImageFile,
  manageImage,
  deleteImage,
};
