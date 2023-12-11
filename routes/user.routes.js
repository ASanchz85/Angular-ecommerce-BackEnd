const express = require("express");
const router = express.Router();
const controllers = require("../controllers/userController");

router.get("/email", controllers.findUserByEmail);
router.post("/login", controllers.findUserByName);
router.post("/", controllers.createUser);


module.exports = router;
