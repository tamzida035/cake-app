// this file contains all endpoints accessible by registered users
var express = require('express');
var router = express.Router();


// Require registered user controller (not sure if need to modify this)
const user_controller = require("../controllers/allUsersController");

// users home page
router.get("/", user_controller.home_ui);//--->Important : update architecture diagam about this route

module.exports = router;
