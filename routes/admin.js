var express = require('express');
var router = express.Router();

// Require admin controllers
const admin_controller = require("../controllers/adminController");

// admin login page
router.get("/login", admin_controller.index);

module.exports = router;