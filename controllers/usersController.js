// purpose: provides a wrapper to catch exceptions thrown in route handler functions.
const asyncHandler = require("express-async-handler");

//importing dotenv package to share contents of .env file
let dotenv=require("dotenv").config();

const session_name=process.env.SESSIONCOOKIENAME;


const {
    logOut,
}=require("../services/userServices/userLogOut");

const {
    getAllIngredients,
}=require("../services/userServices/getIngredients");

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

//load add new recipe by voice page (GET)
exports.addNewVoiceRecipePage = asyncHandler(async (req, res,next) => {
 
  console.log("I arrived");
  //const ingredients=await getAllIngredients();
  //console.log("show ingred list "+ingredients);
  res.render("user_views/add_new_voice_recipe", {});

});


//process new voice recipe (POST)
exports.processNewVoiceRecipe = asyncHandler(async (req, res,next) => {
 
  console.log("process recipe");
  //res.render("user_views/add_new_voice_recipe", {});
  

});

//send ingredients list to client when it sends request to server(GET)
exports.getIngredients=asyncHandler(async (req, res,next) => {
  console.log("not getting called");
  let ingredients=await getAllIngredients();
  if(ingredients==='database is empty')
  {
    res.json({msg: 'Ingredients database is empty.  Please try again letter'});
  }
  else if(ingredients instanceof Error)
  {
    //test only
    let err_msg=ingredients.message+". Please try again letter";
    //res.json({msg: e.message});
    res.json({msg: err_msg});
  }
  else{
    /*let e=new Error("how");
    let err_msg=e.message+". Please try again letter";*/
    //res.json({msg: 'Ingredients database is empty. please try again letter'});
    res.json(ingredients);
  }
  
});




