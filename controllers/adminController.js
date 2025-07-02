// purpose: provides a wrapper to catch exceptions thrown in route handler functions.
const asyncHandler = require("express-async-handler");
// hash the password
const bcrypt = require("bcryptjs");
const{
    checkAdminPassword,
}=require("../models/adminLogin");
// importing adminLogin class
const login=require('../models/adminLogin');



const { body, validationResult } = require("express-validator");


// admin login page
exports.index = asyncHandler(async (req, res, next) => {
  res.render("admin_login_page", {});
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
            res.render("admin_login_page", {errors: errors.array()});
            return;
        }

        // Data from loginform is valid.
        const typed_password =req.body.adminpassword;
        try{
            const db_password=await checkAdminPassword(function(results){
                if(results[0].password===typed_password)
                {
                    //load admin home page
                    res.redirect("/admin/home");
                }
                else{
                   //const msg="mismatched passwords"
                   res.render("admin_login_page", {msg: 'You have entered wrong password.'});
                   //res.status(401).json({error:"mismatched password"});
                   return;
                }
            });
        }
        catch(err){
            // not yet tested
            res.render("admin_database_errors", {error: err.message});
           // console.error(`Error while getting Records `, err.message);
            next(err);
        }

    }),
];

//approach 2
/*exports.authenticateAdmin=asyncHandler(async(req,res)=>{
    // Validate and sanitize the adminpassword field.

    const typed_password =req.body.adminpassword;
    if(!typed_password)
    {
        res.status(400).json({error:"empty password field"});
        return;
    }
    try{
        const db_password=await checkAdminPassword(function(results){
            if(results[0].password===typed_password)
            {
               //load admin home page
              res.redirect("/admin/home");
            }
            else
            {
                res.status(401).json({error:"mismatched password"});
                return;
            }
        });
    }
    catch(err)
    {
        // give pug template here
        console.error(`Error while getting Records `, err.message);
        next(err);

    } 
});*/

// admin home page
exports.home = asyncHandler(async (req, res, next) => {
  // verify here that admin has logged in(session var)
  res.render("admin_home_page", {});
});