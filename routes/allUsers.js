var express = require('express');
var router = express.Router();

// this file contains all endpoints accessible by site visitors

// Require home controller
const site_visitor_controller = require("../controllers/allUsersController");

// home page load
router.get("/", site_visitor_controller.home_ui);//--->Important : update architecture diagam about this route (homepage), controller(homeController)

//user sign up page load
router.get("/user_sign_up", site_visitor_controller.signUpPage); // update archi diagram

//user signing up 
router.post("/user_sign_up", site_visitor_controller.signUp); // update archi diagram

// user login page load
router.get("/user_login", site_visitor_controller.signInPage); // update archi diagram

//user loging in
router.post("/user_login", site_visitor_controller.signIn); // update archi diagram

//route to verify new user email address
//router.get("/new-user/:userid/verify-email",site_visitor_controller.verifyNewUser); // update archi diagram (SHOULD be here on in registeredUser file?)
router.get("/new-user/:userid/verify-email",site_visitor_controller.verifyNewUser);//OK
//resend verification email
router.post("/resend_verification", site_visitor_controller.resendVerficationEmail); //OK, update archi diagram

//resend verification email page
router.get("/resend_verification", site_visitor_controller.resendVerficationEmailPage); // update archi diagram

//user login page authentication
//router.post("/login", admin_controller.authenticateAdmin);
module.exports = router;