// purpose: provides a wrapper to catch exceptions thrown in route handler functions.
const asyncHandler = require("express-async-handler");
// hash the password
//const bcrypt = require("bcryptjs");
//import database functions needed for admin login
const{
    //checkAdminPassword,
    insertHashedPassword,
    deletePassword
}=require("../models/adminLogin");
// importing adminLogin class (TO DO: delete tis)
const login=require('../models/adminLogin');
// just testing
//const db=require('../util/database');

//import database functions needed for admin adding ingredients to database
//const insertIngredient=require("../models/Ingredients");//original code
/*const {
    insertIngredient
}=require("../models/Ingredients");*/

const {
    authenticate,
}=require("../services/adminServices/adminAuthentication");

const {
    logOut,
}=require("../services/adminServices/adminSignOut");

//import utility functions
/*const{
    MIN_INGREDIENT_INPUT_LENGTH,
}=require("../parameters/admin_parameters");*/

const{
    validateAndSanitizeIngredient
}=require("../validators/IngredientFieldValidator");

const{
    organizeAltIngredients,
    getAltIngredient
}=require("../utils/OrganizeIngredients");

const {
    addIngredients,
}=require("../services/adminServices/addIngredients");


//importing dotenv package to share contents of .env file
var dotenv=require("dotenv").config();

const session_name=process.env.SESSIONCOOKIENAME;

const { body, check, validationResult } = require("express-validator");



// admin login page(not shown in archi diagram (view))
exports.signIn_ui = asyncHandler(async (req, res, next) => {
    //to do:middleware check: if admin prev session has been saved and yet available, redirect admin to his dashboard
  res.render("admin_views/admin_login_page", {});
});




//post function to process admin login
exports.signIn=[
    // Validate and sanitize the adminpassword field.
    body("adminpassword", "Password field cannot be empty")
    .trim()
    .notEmpty(),


    // Process request after validation and sanitization.
    asyncHandler(async(req,res)=>{
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // There are errors. Render the form again with sanitized values/error messages.
        if (!errors.isEmpty()) {
            res.render("admin_views/admin_login_page", {errors: errors.array()});
            return;
        }

        // Data from loginform is valid.
        const typed_password =req.body.adminpassword;

        //authenticate admin
        const is_matched=await authenticate(res,typed_password);
        console.log("is_matched: "+is_matched);
        if(is_matched==true) // to do: if req.session.data===undefined
        {
            //Authenticate admin
            let loggedin_admin_data = {role: "admin",status: 'ready-to-login',firstname: 'admin',};
            req.session.data = loggedin_admin_data;
            //session id accessible by req.session.id
            console.log(req.session.data);

            //load admin home page
            res.redirect("/admin/home");
        }
        else{
            res.render("admin_views/admin_database_errors", {error: is_matched});
        }


        //NOTE: the admin password has been hashed before inserting into db.It has been executed only once and need not be executed further
        /*const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(typed_password, salt);

        console.log("hashed_password: "+hashedPassword);
        try{
            await insertHashedPassword(hashedPassword);
              
        }
        catch(err){

            console.error(`Error while inserting hashed password into admin password table (adminController.js NO) `, err.message);
           // next(err);
        }*/

        //DELETE THIS CODE: delete the unhashed password from the db
        /*try{
            await deletePassword();
        }
        catch(err){

        }*/
        //previous working code
        /*try{
            const db_password=await checkAdminPassword(function(results){
                if(results[0].password===typed_password)
                {
                    // Authenticate the user
                   // req.session.loggedin = true;
                    var loggedin_user_data = {role: "admin",status: 'logged-in',firstname: 'admin',lastname: '',};
                    req.session.data = loggedin_user_data;
                    //load admin home page
                    res.redirect("/admin/home");
                }
                else{
                   //const msg="mismatched passwords"
                   res.render("admin_views/admin_login_page", {msg: 'You have entered wrong password.'});
                   //res.status(401).json({error:"mismatched password"});
                   return;
                }
            });
        }
        catch(err){
            // not yet tested
            res.render("admin_views/admin_database_errors", {error: err.message});
           // console.error(`Error while getting Records `, err.message);
            next(err);
        }*/

    }),
];


//admin home page(not shown in archi diagram (view))
exports.home_ui = asyncHandler(async (req, res, next) => {
  // allow only admin to access admin home page
  // to do: move this authenti middleware to a separate new file 'authMiddleware' inside (by creating) folder 'middleware'
  if (req.session.data){
    if (req.session.data.role=='admin'){
        if(req.session.data.status=='ready-to-login')
        {
            req.session.data.status='logged-in';
            res.render("admin_views/admin_home_page", {welcome_msg:'show login success alert'});

        }
        else{
            res.render("admin_views/admin_home_page", {});

        }

    }
    else
    {
        // do not allow logged-in users access
        res.render("error_views/unauthorized_access", {error_msg:'Only admin is authorized to perform this request !'});

    }
  }
  else
  {
    //actual
    res.render("error_views/unauthorized_access", {error_msg:'You are not logged-in. You are not authorized to perform this request !'});
    
  }
});


//admin logout(not shown in archi diagram)
// to do: move this authenti middleware to a separate new file 'authMiddleware/logoutMiddleware' inside (by creating) folder 'middleware'
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

// allow access to add ingredients page directly on admin clicking 'admin access' button on all user home page only if admin session is valid(dont think it needs to be shown in archi diagram)
// to do: move this authenti middleware to a separate new file 'authMiddleware' inside (by creating) folder 'middleware'
exports.add_Ingredients_Page = asyncHandler(async (req, res, next) => {
   if (req.session.data){
    if (req.session.data.role=='admin'&& req.session.data.status=='logged-in'){
        res.render("admin_views/admin_add_ingredients", {});

    }
    else{
        // do not allow logged-in users access
        res.render("error_views/unauthorized_access", {error_msg:'Only admin is authorized to perform this request!'});
    }
   }
   else
  {
    //actual 
    res.render("error_views/unauthorized_access", {error_msg:'You are not logged-in. You are not authorized to perform this request !'});
    
  }
   
});



//post function to process the add_ingredients form
let sanitized_main_ingred;
let sanitized_dyn_field1;
let sanitized_dyn_field2;
let sanitized_dyn_field3;
exports.validate_Ingredients = [
    // Validate and sanitize the input fields. (server side form validation)
    //the main ingredient field
    body("ingred_field")
    .custom(async value => {
        sanitized_main_ingred=validateAndSanitizeIngredient("Main Ingredient","",value);
    }),// the radio button field
    body("options")
    .custom(async value2 => {
        if(value2==undefined)
        {
            throw new Error('Main Ingredients status was not selected');
        }
    }),
    body("dynamicField1")// dynamic field 1
    .optional()
    .custom(async value => {
        sanitized_dyn_field1=validateAndSanitizeIngredient("Alternative Ingredient 1","",value);
        
    }),
     body("dynamicField2")// dynamic field 2
    .optional()
    .custom(async value => {
        sanitized_dyn_field2=validateAndSanitizeIngredient("Alternative Ingredient 2","",value);
        
    }),
     body("dynamicField3")// dynamic field 3
    .optional()
    .custom(async value => {
        sanitized_dyn_field3=validateAndSanitizeIngredient("Alternative Ingredient 3","",value);
        
    }),
    
    // Process request after validation and sanitization.
    asyncHandler(async(req,res,next)=>{
        
        //Extract the validation errors from a request.
        const result = validationResult(req);//original code
        //const errors = result.array();
        //const errors = myValidationResult(req).array();
        const result2 = result.formatWith(error => error.msg);
        const errors2 = result2.array();
       //console.log("errors: "+result2);

        // There are errors. Render the form again with sanitized values/error messages.
        if (!result.isEmpty()) {
            
            //for testing purpose only
            //res.status(500).json(errors2);
            res.render("admin_views/admin_add_ingredients", {errors: result.array(), }); //original code
            return;
        }
        // Data from add ingred form is valid.
        //const main_ingredient =req.body.ingred_field;//req.assert('name',"Valid name is required!").optional().isName();
        const main_ingredient =sanitized_main_ingred;
        const main_ingred_status=req.body.options;
        
        let alt_ingred_1=getAltIngredient(req.body.dynamicField1,sanitized_dyn_field1);
        let alt_ingred_2=getAltIngredient(req.body.dynamicField2,sanitized_dyn_field2);
        let alt_ingred_3=getAltIngredient(req.body.dynamicField3,sanitized_dyn_field3);;
        
        //check if alternative ingredients are given and even if so, the order may be random eg dynamicfield3 has valid input but other dynfields have been deleted
        //in that case convert the valid alternative const alt_ingred_1=ingredients into json object in correct order
        let alt_list=organizeAltIngredients(alt_ingred_1,alt_ingred_2,alt_ingred_3);


        //insert data into database
        const msg=await addIngredients(main_ingredient,main_ingred_status,alt_list); 
        res.render("admin_views/admin_add_ingredients", {add_ingred_msg:msg});

        //for testing purpose only
        //res.status(500).json(msg);

        
    }),

];


