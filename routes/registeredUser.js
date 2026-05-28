// this file contains all endpoints accessible by registered users
let express = require('express');
let router = express.Router();
const{
    isVerifiedUser,
}=require('../middleware/userMiddleware');


// Require registered user controller (not sure if need to modify this)
const user_controller = require("../controllers/usersController");

// users personal home page
//router.get("/profile/:userid",isVerifiedUser,user_controller.profile); //make it work
router.get("/profile/:userid",user_controller.profile);//--->Important : update architecture diagam about this route

//user sign out route
router.get("/profile/:id/logout",user_controller.signOut);
module.exports = router;
