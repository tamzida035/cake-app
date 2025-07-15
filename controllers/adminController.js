// purpose: provides a wrapper to catch exceptions thrown in route handler functions.
const asyncHandler = require("express-async-handler");
// hash the password
const bcrypt = require("bcryptjs");
const{
    checkAdminPassword,
    insertHashedPassword,
    deletePassword
}=require("../models/adminLogin");
// importing adminLogin class
const login=require('../models/adminLogin');
//importing dotenv package to share contents of .env file
var dotenv=require("dotenv").config();

const session_name=process.env.SESSIONCOOKIENAME;

const { body, validationResult } = require("express-validator");


// admin login page
exports.index = asyncHandler(async (req, res, next) => {
  res.render("admin_views/admin_login_page", {});
});

//post function to process admin login
exports.authenticateAdmin=[
    // Validate and sanitize the adminpassword field.
    body("adminpassword", "Password field cannot be empty")
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

        console.log("typed_password: "+typed_password);

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
        // decrypt the password in the database before comparing it with user entered password
        try{
            const db_password=await checkAdminPassword(function(results){
                const passwordMatch = bcrypt.compare(typed_password,results[0].password);
                if(passwordMatch){
                    // Authenticate the user
                     var loggedin_user_data = {role: "admin",status: 'logged-in',firstname: 'admin',lastname: '',};
                     req.session.data = loggedin_user_data;
                     //load admin home page
                      res.redirect("/admin/home");
                }
                else{
                    res.render("admin_views/admin_login_page", {msg: 'You have entered wrong password.'});
                    return;

                }
                 
            });
        }
        catch(err){
            // not yet tested
           // res.render("admin_views/admin_database_errors", {error: err.message});--> TO DO: CORRECT INDENTATION ERROR present here
            console.error(`Error while getting Records `, err.message);
            next(err);
        }

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



exports.home = asyncHandler(async (req, res, next) => {
  // allow only admin to access admin home page
  if (req.session.data){
    if (req.session.data.role=='admin'){
        res.render("admin_views/admin_home_page", {welcome_msg:'Welcome back home, admin!'});
    }
    else
    {
        // do not allow logged-in users access
        res.render("error_views/unauthorized_access", {error_msg:'Only admin is authorized to perform this request !'});

    }
  }
  else
  {
    res.render("error_views/unauthorized_access", {error_msg:'You are not logged-in. You are not authorized to perform this request !'});
    
  }

  /*if (req.session.data.role=='admin')
  {
    res.render("admin_home_page", {});
  }*/
 //res.render("admin_home_page", {});
});

exports.logOut = asyncHandler(async (req, res, next) => {
    req.session.destroy(function(err) {
    if (err) {
      //res.send('An err occured: ' +err.message);
      res.render("admin_views/admin_login_page", {error_msg:err.message});
    } else {
      var message = 'You have been successfully logged out';
      res.status(200).clearCookie(session_name).redirect('/');
    }
})
});