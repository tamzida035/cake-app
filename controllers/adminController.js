// purpose: provides a wrapper to catch exceptions thrown in route handler functions.
const asyncHandler = require("express-async-handler");
// hash the password
const bcrypt = require("bcryptjs");
//import database functions needed for admin login
const{
    checkAdminPassword,
    insertHashedPassword,
    deletePassword
}=require("../models/adminLogin");
// importing adminLogin class (TO DO: delete tis)
const login=require('../models/adminLogin');
// just testing
//const db=require('../util/database');

//import database functions needed for admin adding ingredients to database
const insertIngredient=require("../models/Ingredients");

//importing dotenv package to share contents of .env file
var dotenv=require("dotenv").config();

const session_name=process.env.SESSIONCOOKIENAME;

const { body, check, validationResult } = require("express-validator");

//import utility functions
const{
    invalidApostrophe,
    MIN_INGREDIENT_INPUT_LENGTH,
}=require("../util/functions");


// admin login page
exports.index = asyncHandler(async (req, res, next) => {
  res.render("admin_views/admin_login_page", {});
});

//post function to process admin login
exports.authenticateAdmin=[
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

        //console.log("typed_password: "+typed_password);

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
                bcrypt.compare(typed_password, results[0].password, (err, is_matched) => {
                    if(err)
                    {
                        console.error('Error comparing passwords: ' + err);// to do: put error template here
                    }
                    else if(is_matched)
                    {
                        //console.log('Password is correct');
                        // Authenticate the user
                         var loggedin_user_data = {role: "admin",status: 'ready-to-login',firstname: 'admin',lastname: '',};
                         req.session.data = loggedin_user_data;
                         //load admin home page
                         res.redirect("/admin/home");

                    }
                    else{
                        //console.log('Password is incorrect');
                        res.render("admin_views/admin_login_page", {msg: 'You have entered wrong password.'});
                        return;

                    }
                });
                 
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


//admin home page
exports.home = asyncHandler(async (req, res, next) => {
  // allow only admin to access admin home page
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
    res.render("error_views/unauthorized_access", {error_msg:'You are not logged-in. You are not authorized to perform this request !'});
    
  }
});


//admin logout
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
// allow access to add ingredients page only if admin session is valid
exports.add_Ingredients_Page = asyncHandler(async (req, res, next) => {
   if (req.session.data){
    if (req.session.data.role=='admin'&& req.session.data.status=='logged-in'){
        res.render("admin_views/admin_add_ingredients", {});

    }
    else{
        // do not allow logged-in users access
        res.render("error_views/unauthorized_access", {error_msg:'Only admin is authorized to perform this request !'});
    }
   }
   else
  {
    res.render("error_views/unauthorized_access", {error_msg:'You are not logged-in. You are not authorized to perform this request !'});
    
  }
   
});

//post function to sprocess the add_ingredients form
let sanitized_main_ingred;
let sanitized_dyn_field1;
let sanitized_dyn_field2;
let sanitized_dyn_field3;
exports.validate_Ingredients = [
    // Validate and sanitize the input fields. (server side form validation)
    //the main ingredient field
    body("ingred_field")
    .custom(async value => {
        if(value.trim()=='')
            throw new Error('Main Ingredient field was empty'); 
        //console.log("len: "+value.length);
        sanitized_main_ingred="";
        var splitted_words=value.split(/\s+/);
        var pattern = /^[a-zA-Z]+['\-]?[a-zA-Z]{1,}$/;// seems to work correctly
        for (var w=0; w<splitted_words.length;w++)
        {
         //console.log("w: "+splitted_words[w]);
         //console.log(splitted_words[w].match(pattern));
         if(splitted_words[w]=='')
            continue;
         if(!splitted_words[w].match(pattern))
         {
          if(value.length<MIN_INGREDIENT_INPUT_LENGTH)
          {
            var input='Main ingredient: '+value+' did not meet input requirements and length was too short';
            throw new Error(input);
          }
          else
          {
            
            var input='Main ingredient: '+value+' did not meet input requirements';
            throw new Error(input);
          }
         }
         else
         {
            if(value.length<MIN_INGREDIENT_INPUT_LENGTH)
            {
                var input='Main ingredient: '+value+' length was too short';
                throw new Error(input);
            }
            else
            {
                if(w==0) sanitized_main_ingred+=splitted_words[w];
                else sanitized_main_ingred+=(" "+splitted_words[w]);
            }


         }
        }
    }),// the radio button field
    body("options")
    .custom(async value2 => {
        if(value2==undefined)
        {
            //error_option_field='main ingredients status was not selected';
            throw new Error('main ingredients status was not selected');
        }
    }),

    body("dynamicField1")// dynamic field 1
    .optional()
    .custom(async value => {
        if(value.trim()=='')
        {
            throw new Error('Alternative Ingredient 1: field was empty');
        }
        console.log("value: "+value);
        sanitized_dyn_field1="";
        var splitted_words=value.split(/\s+/);
        var pattern = /^[a-zA-Z]+['\-]?[a-zA-Z]{1,}$/;// seems to work correctly
        for (var w=0; w<splitted_words.length;w++)
        {
         console.log("w: "+splitted_words[w]);
         console.log(splitted_words[w].match(pattern));
         if(splitted_words[w]=='')
            continue;
         if(!splitted_words[w].match(pattern))
         {
          if(value.length<MIN_INGREDIENT_INPUT_LENGTH)
          {
            var input='Alternative Ingredient 1: '+value+' did not meet input requirements and length was too short';
            throw new Error(input);
          }
          else{
            var input='Alternative Ingredient 1: '+value+' did not meet input requirements';
            throw new Error(input);
           }
         }
         else
         {
            if(value.length<MIN_INGREDIENT_INPUT_LENGTH)
            {
                var input='Alternative Ingredient 1: '+value+' length was too short';
                throw new Error(input);
            }
            else
            {
                console.log("I am here "+w);
                if(w==0) sanitized_dyn_field1+=splitted_words[w];
                else sanitized_dyn_field1+=(" "+splitted_words[w]);
            }

         }
        }
        
    }),
     body("dynamicField2")// dynamic field 2
    .optional()
    .custom(async value => {
        if(value.trim()=='')
            throw new Error('Alternative Ingredient 2: field was empty');
        sanitized_dyn_field2="";
        var splitted_words=value.split(/\s+/);
        var pattern = /^[a-zA-Z]+['\-]?[a-zA-Z]{1,}$/;// seems to work correctly
        for (var w=0; w<splitted_words.length;w++)
        {
         if(splitted_words[w]=='')
            continue;
         if(!splitted_words[w].match(pattern)){
          if(value.length<MIN_INGREDIENT_INPUT_LENGTH)
          {
            var input='Alternative Ingredient 2: '+value+' did not meet input requirements and length was too short';
            throw new Error(input);
          }
          else
          {
            var input='Alternative Ingredient 2: '+value+' did not meet input requirements';
            throw new Error(input);
            
          }
         }
         else
         {
            if(value.length<MIN_INGREDIENT_INPUT_LENGTH){
               var input='Alternative Ingredient 2: '+value+' length was too short';
               throw new Error(input);
            }
            else
            {
                if(w==0) sanitized_dyn_field2+=splitted_words[w];
                else sanitized_dyn_field2+=(" "+splitted_words[w]);
            }


         }

        }
        
    }),
     body("dynamicField3")// dynamic field 3
    .optional()
    .custom(async value => {
        if(value.trim()=='')
            throw new Error('Alternative Ingredient 3: field was empty');
        sanitized_dyn_field3="";
        var splitted_words=value.split(/\s+/);
        var pattern = /^[a-zA-Z]+['\-]?[a-zA-Z]{1,}$/;// seems to work correctly
        for (var w=0; w<splitted_words.length;w++)
        {
         if(splitted_words[w]=='')
            continue;
         if(!splitted_words[w].match(pattern)){
          if(value.length<MIN_INGREDIENT_INPUT_LENGTH){
            var input='Alternative Ingredient 3: '+value+' did not meet input requirements and length was too short';
            throw new Error(input);
          }
          else{
             var input='Alternative Ingredient 3: '+value+' did not meet input requirements';
             throw new Error(input);

          }
         }
         else
         {
            if(value.length<MIN_INGREDIENT_INPUT_LENGTH){
                var input='Alternative Ingredient 3: '+value+' length was too short';
                throw new Error(input);
            }
            else
            {
                if(w==0) sanitized_dyn_field3+=splitted_words[w];
                else sanitized_dyn_field3+=(" "+splitted_words[w]);
            }

         }
    
        }
        
    }),
    

    // Process request after validation and sanitization.
    asyncHandler(async(req,res)=>{
        
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // There are errors. Render the form again with sanitized values/error messages.
        if (!errors.isEmpty()) {
            //res.render("admin_views/admin_add_ingredients", {errors: errors.array(), e1: error_ingred_field, e2: error_option_field, e3:error_dyn_field1 });
            res.render("admin_views/admin_add_ingredients", {errors: errors.array(), });
            return;
        }
        // Data from add ingred form is valid.
        //const main_ingredient =req.body.ingred_field;//req.assert('name',"Valid name is required!").optional().isName();
        const main_ingredient =sanitized_main_ingred;
        console.log("main: "+main_ingredient);
        const main_ingred_status=req.body.options;
        let alt_ingred_1=req.body.dynamicField1;
        if(alt_ingred_1!=undefined)
        {
          alt_ingred_1=sanitized_dyn_field1;
          console.log("alt ingred 1: "+alt_ingred_1);
        }
        let alt_ingred_2=req.body.dynamicField2;
        if(alt_ingred_2!=undefined)
          alt_ingred_2=sanitized_dyn_field2;
        let alt_ingred_3=req.body.dynamicField3;
        if(alt_ingred_3!=undefined)
          alt_ingred_3=sanitized_dyn_field3;
        //console.log(main_ingredient+" "+main_ingred_status+" "+alt_ingred_1+" "+alt_ingred_2+" "+alt_ingred_3);
        let alt_list;
        //check if alternative ingredients are given and even if so, the order may be random eg dynamicfield3 has valid input but other dynfields have been deleted
        //in that case convert the valid alternative const alt_ingred_1=ingredients into json object in correct order
        if(alt_ingred_1==undefined)
        {
           if(alt_ingred_2==undefined)
           {
             if(alt_ingred_3==undefined)
             {
                //set json object to null
                const alt_ingred_list={alternative_ingredient_1: null};
                const json_list=JSON.stringify(alt_ingred_list);
                alt_list=json_list;
                //console.log(json_list);

             }
             else{
                //only dynamicField3 has valid input
                const alt_ingred_list={alternative_ingredient_1: alt_ingred_3};
                const json_list=JSON.stringify(alt_ingred_list);
                alt_list=json_list;
                //console.log(json_list);
             }

           }
           else
           {
             if(alt_ingred_3==undefined)
             {
                //only dynamicField2 has valid input
                const alt_ingred_list={alternative_ingredient_1: alt_ingred_2};
                const json_list=JSON.stringify(alt_ingred_list);
                alt_list=json_list;
                //console.log(json_list);

             }
             else
             {
                //dynamicField2,dynamicField3 have valid inputs
                const alt_ingred_list={alternative_ingredient_1: alt_ingred_2,alternative_ingredient_2: alt_ingred_3};
                const json_list=JSON.stringify(alt_ingred_list);
                alt_list=json_list;
                //console.log(json_list);

             }
           }
        }
        else{
           if(alt_ingred_2!=undefined)
           {
             if(alt_ingred_3!=undefined)
             {
               //all dynamicFIELDS have valid inputs
               const alt_ingred_list={alternative_ingredient_1: alt_ingred_1,alternative_ingredient_2: alt_ingred_2,alternative_ingredient_3: alt_ingred_3};
               const json_list=JSON.stringify(alt_ingred_list);
               alt_list=json_list;
               //console.log(json_list);

             }
             else{
                //dynamicField2,dynamicField1 have valid inputs
                const alt_ingred_list={alternative_ingredient_1: alt_ingred_1,alternative_ingredient_2: alt_ingred_2};
                const json_list=JSON.stringify(alt_ingred_list);
                alt_list=json_list;
                //console.log(json_list);
             }
           } 
           else{
            if(alt_ingred_3!=undefined)
            {
                //dynamicField1,dynamicField3 have valid inputs
                const alt_ingred_list={alternative_ingredient_1: alt_ingred_1,alternative_ingredient_2: alt_ingred_3};
                const json_list=JSON.stringify(alt_ingred_list);
                alt_list=json_list;
                //console.log(json_list);

            }
            else{
                //only dynamicField1 has valid input
                const alt_ingred_list={alternative_ingredient_1: alt_ingred_1};
                const json_list=JSON.stringify(alt_ingred_list);
                alt_list=json_list;
                //console.log(json_list);

            }

           }
        }
        try{
            
            const inserted_data= await insertIngredient(main_ingredient,main_ingred_status,alt_list);// works fine
            console.log("inserted_data "+inserted_data);
            res.render("admin_views/admin_add_ingredients", {add_ingred_msg:"Ingredient(s) has been successfully added to database."});
            
        }
        catch(err){
            //res.render("admin_views/admin_add_ingredients", {add_ingred_msg:err.message});
            res.render("admin_views/admin_add_ingredients", {add_ingred_msg:"main Ingredient already exists in database."});//usethis
        }
        
    }),

];
