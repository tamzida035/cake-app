var express = require('express');
var router = express.Router();

// Require admin controllers
const admin_controller = require("../controllers/adminController");

// admin login page load
router.get("/login", admin_controller.index);

//admin login page authentication
router.post("/login", admin_controller.authenticateAdmin);

//admin home page
router.get("/home",admin_controller.home);

module.exports = router;