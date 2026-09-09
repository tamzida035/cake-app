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
  //if session does not exist
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
  			if(req.session.data.status=='ready-to-login')
        {
          req.session.data.status='logged-in';
          res.render("user_views/user_home", {welcome_msg:'show login success alert',user:req.session.data.firstname,});
        }
        else res.render("user_views/user_home",{welcome_msg:'',});
  		}

  	}
  	else res.render("error_views/unauthorized_access", {error_msg:'only verified user is allowed access !'});
  }
  /*if (req.session.data!==undefined)
  {
    if(req.session.data.status=='ready-to-login')
    {
      req.session.data.status='logged-in';
      res.render("user_views/user_home", {welcome_msg:'show login success alert',user:req.session.data.firstname,});
    }
    else res.render("user_views/user_home",{welcome_msg:'',});
  }*/
  
});

//user sign out
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

//load add new recipe by voice page
exports.addNewVoiceRecipePage = asyncHandler(async (req, res,next) => {
 
  console.log("I arrived");
  res.render("user_views/add_new_voice_recipe", {});
  //res.render("user_views/user_home", {welcome_msg:'',});

});


//process new voice recipe 
exports.processNewVoiceRecipe = asyncHandler(async (req, res,next) => {
 
  console.log("process recipe");
  res.render("user_views/add_new_voice_recipe", {});
  //res.render("user_views/user_home", {welcome_msg:'',});

});

