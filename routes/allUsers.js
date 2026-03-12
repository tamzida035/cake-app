var express = require('express');
var router = express.Router();

// this file contains all endpoints accessible by site visitors

// Require home controller
const site_visitor_controller = require("../controllers/allUsersController");

// home page load
router.get("/", site_visitor_controller.home_ui);//--->Important : update architecture diagam about this route (homepage), controller(homeController)

//user sign up page load
router.get("/user_sign_up", site_visitor_controller.signUpPage); // update archi diagram

//user sign up 
router.post("/user_sign_up", site_visitor_controller.signUp); // update archi diagram

// user login page load
router.get("/user_login", site_visitor_controller.signInPage); // update archi diagram



//user login page authentication
//router.post("/login", admin_controller.authenticateAdmin);
module.exports = router;