// purpose: provides a wrapper to catch exceptions thrown in route handler functions.
const asyncHandler = require("express-async-handler");
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require("uuid");

const { body, check, validationResult } = require("express-validator");

//importing dotenv package to share contents of .env file
var dotenv=require("dotenv").config();

const session_name=process.env.SESSIONCOOKIENAME;

const{
    validateName,
    validateEmail,
    validatePassword,
    validateConfirmPassword
}=require("../validators/SigningValidators");


const {
    checkUsername,
    doesUserTableExist,
    checkUserEmail,
    registerNewUser,
    verifyUserEmailId,
}=require("../services/allUserServices/userSignUp");

// loads website home page
exports.home_ui = asyncHandler(async (req, res, next) => {
 //if session varible for admin is 
 if (req.session.data){
    if(req.session.data.role=='admin')// if admin has previously logged-in and the session had been saved
    {
       res.redirect("/admin/home");
    }
    else{

    }

 }
 else{
    //default website home page
    res.render("index", {});

 }

});

// users sign-in page
exports.signInPage=asyncHandler(async (req, res, next) => {
   if (req.session.data){
      if (req.session.data.role=='user'){
        if(req.session.data.status=='ready-to-login') // registered user logging in (session saved) do it later
        {
            req.session.data.status='logged-in';
            //res.render("admin_views/admin_home_page", {welcome_msg:'show login success alert'});

        }
        else if(req.session.data.status=='first-time-login')// new user first ever login
        {
            req.session.data.status='logged-in';
            res.render("site_visitor_views/sign_in_page", {msg: 'sign-in into your new account'});

        }

      }
   }
   else{
      //default sign-in page
      res.render("site_visitor_views/sign_in_page", {});
   }
    
});

// users sign-up page
exports.signUpPage=asyncHandler(async (req, res, next) => {
   res.render("site_visitor_views/sign_up_page", {}); //original page
   //res.render("site_visitor_views/experiment_sign_up_page", {});
});

// users sign-up/registration 
/*exports.signUp=asyncHandler(async (req, res, next) => {
   //sanitize and store data on db
   //redirect to sign-in page. send msg "sign-in into your new account"
   var new_user_data = {role: "user",status: 'first-time-login',firstname: 'user',};
   req.session.data = new_user_data;
   console.log(new_user_data);
   //res.redirect("/user_login");
});*/

//post function to process the add_ingredients form
let is_pwd_valid,pwd;
exports.signUp = [
    // Validate and sanitize the input fields. (server side form validation)
    //the display name field
    body("name_field")
    .custom(async value => {
        validateName("Display name",value);
     }),
    body("email_field")
    .custom(async value => {
        validateEmail("Email Id",value);
     }),
    body("password_field")
    .custom(async value => {
        is_pwd_valid=validatePassword("Password",value);
       // console.log("Password: "+is_pwd_valid);
        if(is_pwd_valid) pwd=value;
     }),
    body("confirm_password_field")
    .custom(async value => {
        //console.log("collected Password: "+pwd);
        let h=validateConfirmPassword(pwd,value,"Confirm password");
        //console.log("after collected Password: "+h);
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
            let errors=result.array();
            /*if(errors[0].msg=='display name field was empty')
               console.log("yes");*/
            let e1,e2,e3,e4;
            e1="";
            e2="";
            e3="";
            e4="";
            for (let x of errors){
              if(x.msg.startsWith("Display"))
                e1=x.msg;
              else if(x.msg.startsWith("Email"))
                e2=x.msg;
              else if(x.msg.startsWith("Password"))
                e3=x.msg;
              else if(x.msg.startsWith("Confirm")||x.msg==="passwords do not match")
                e4=x.msg;
            }
            res.render("site_visitor_views/sign_up_page", {errors: result.array(),name_field_error:e1,email_field_error:e2,password_field_error:e3,confirm_password_field_error:e4 }); //original code
            return;
        } 
        else
        {
          //Data from add ingred form is valid.
          let username=req.body.name_field.trim();
          let email=req.body.email_field;
          
          //checks that user table already exists.If not, create the table
          const result1=await doesUserTableExist();

          if(result1=="user table exists")
          {
            //check if username is already taken. if yes, give error message
            const result2=await checkUsername(res,username);
            if(result2=="username not taken")
            {
              //check if email is already taken. if yes, give error message
              const result3=await checkUserEmail(res,email);
              if(result3=="email address not taken")
              {
                //hashed the password before inserting it into db
                /*const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(pwd, salt);

                //generate id for new user
                let userid=uuidv4();

                //verify the user's email address (TO DO)
                let is_user_account_verified=await verifyUserEmailId(userid,username,email,hashedPassword);*/

                //insert new user info into database
                /*const msg=await registerNewUser(userid,username,email,hashedPassword); 
                //console.log(msg);
                if(msg=="new user has been successfully added to database")
                {
                     //redirect user to his personal homepage/dashboard
                     //res.render("site_visitor_views/sign_up_page", {registration_error:msg});

                }
                else{
                     res.render("site_visitor_views/sign_up_page", {registration_error:msg});
                }*/

              }
            }

          }


        }  
        
    }),

];

