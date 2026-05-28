// purpose: provides a wrapper to catch exceptions thrown in route handler functions.
const asyncHandler = require("express-async-handler");

//importing dotenv package to share contents of .env file
var dotenv=require("dotenv").config();

const session_name=process.env.SESSIONCOOKIENAME;


const {
    logOut,
}=require("../services/userServices/userLogOut");

const { body, check, validationResult } = require("express-validator");
// load user personal profile page
exports.profile = asyncHandler(async (req, res,next) => {
 //if session varible for admin is 
  if (req.session.data===undefined){
  	res.render("error_views/unauthorized_access", {error_msg:'login to access this page!'});

  }
  else{
  	if(req.session.data.role=='user')
  	{
  		if(req.session.data.is_user_verified==0)
  		{
  			res.render("error_views/unauthorized_access", {error_msg:'your account is not verified.please verify it.'});
  		}
  		else
  		{
  			if(req.session.data.status=='ready-to-login') req.session.data.status='logged-in';
  		}

  	}
  	else res.render("error_views/unauthorized_access", {error_msg:'only verified user is allowed access !'});
  }
  //console.log("already logged in");
  //res.render("user_views/user_home", {});

  res.render("user_views/user_home", {welcome_msg:'show login success alert',user:req.session.data.firstname,});

 //next();
});

//user sign out function
exports.signOut = asyncHandler(async (req, res, next) => {
    logOut(req,res,session_name);
    //original code
    /*req.session.destroy(function(err) {
    if (err) {
      //res.send('An err occured: ' +err.message);
      res.render("admin_views/admin_login_page", {error_msg:err.message});
    } else {
      var message = 'You have been successfully logged out';
      res.status(200).clearCookie(session_name).redirect('/');
    }
})*/
});