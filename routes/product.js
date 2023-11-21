const express = require("express");
const router = express.Router();
const controllers = require("../controllers/productController");

router.post("/", controllers.createProduct);

module.exports = router;
