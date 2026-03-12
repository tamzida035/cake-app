var express = require('express');
var router = express.Router();

// Require admin controller
const admin_controller = require("../controllers/adminController");

// admin login page load
router.get("/login", admin_controller.signIn_ui);

//admin login page authentication
router.post("/login", admin_controller.signIn);

//admin home page load
router.get("/home",admin_controller.home_ui);

//admin log out
router.get("/logout",admin_controller.signOut);

//admin add ingredients page load
router.get("/add_ingredients",admin_controller.add_Ingredients_Page);

//add-ingredients form validation
router.post("/add_ingredients",admin_controller.validate_Ingredients);

//testFunc
//router.post("/add_ingredients",admin_controller.testFunc);


module.exports = router;