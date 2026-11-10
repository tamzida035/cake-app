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

const{
    validateText,
}=require("../validators/commonValidators");


//process multi-part forms
/*const multer = require("multer");
const upload = multer({ dest: "../public/images/" });*/



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


//process new voice recipe (POST) (rough)
/*exports.processNewVoiceRecipe =[
    // Validate and sanitize the input fields. (server side form validation)
    //the recipe name field
    body("recipe_name_field")
    .custom(async value => {
      let condition = /^[a-zA-Z ]{3,25}$/;
      let MIN_RECIPE_NAME_LENGTH=3;
      let MAX_RECIPE_NAME_LENGTH=25;
      console.log("valjue in controller: "+value);
      validateText("Recipe name",value,MIN_RECIPE_NAME_LENGTH,MAX_RECIPE_NAME_LENGTH,condition);
     }),
    // Process request after validation and sanitization.
    asyncHandler(async (req, res,next) => {
       console.log("req file: in controller: "+req.file);
      if (!req.file) {
       console.log('No photo uploaded');
       //res.send({message: 'No file selected'});
      } 
      else {
       console.log('store photo in db');// to do
       //res.json({ message: "Successfully uploaded single file" });
      }
      //console.log("reg body:", req.body);
      const jsonString = JSON.stringify(req.body);
      console.log("json body: "+jsonString);
      //Extract the validation errors from a request.
      const result = validationResult(req);//original code
        //const errors = result.array();
        //const errors = myValidationResult(req).array();
      //for testing purpose only
      //const result2 = result.formatWith(error => error.msg);
      //const errors2 = result2.array();
      // There are errors. Render the form again with sanitized values/error messages.
      if (!result.isEmpty()) {
            
        //for testing purpose only
        //res.status(500).json(errors2);
        let errors=result.array();
        let e1,e2,e3,e4;
        
        for (let x of errors){
          console.log(x);
          if(x.msg.startsWith("Recipe"))
            e1=x.msg;
          else if(x.msg.startsWith("Photo"))
            e2=x.msg;
          else if(x.msg.startsWith("Password"))
            e3=x.msg;
          else if(x.msg.startsWith("Confirm")||x.msg==="passwords do not match")
            e4=x.msg;
        }
        console.log("e1: "+e1);
        //res.render("user_views/add_new_voice_recipe", {errors: result.array(),recipe_name_field_error:e1,photos_field_error:"photo",serve_field_error:"serve",prep_time_field_error:"t",cook_time_field_error:"t",total_time_field_error:"t",equip_field_limit_error:"e"});
        //res.render("user_views/add_new_voice_recipe", {errors2: result.array(),});// not working
        res.locals.errors2=errors;
        //res.render("user_views/add_new_voice_recipe", {});// not working
        res.render("admin_views/admin_home_page", {});

      }
      else{
        console.log("process recipe");
      }

    }),

  ];*/
exports.processNewVoiceRecipe = asyncHandler(async (req, res,next) => {
 
  console.log("process recipe");
  /*console.log("req file "+req.file);
  const jsonString = JSON.stringify(req.body);
  console.log("json body: "+jsonString);
  //console.log("req body "+req.body);
  res.render("user_views/add_new_voice_recipe", {}); */
});

//send ingredients list to client when it sends request to server(GET)
exports.getIngredients=asyncHandler(async (req, res,next) => {
  //console.log("not getting called");
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




