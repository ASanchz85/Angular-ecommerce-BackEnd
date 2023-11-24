const express = require("express");
const router = express.Router();
const controllers = require("../controllers/productController");

router.get("/", controllers.getAllProducts);
router.post("/", controllers.createProduct);
router.put("/:id", controllers.updateProduct);
router.delete("/:id", controllers.deleteProduct);

module.exports = router;
