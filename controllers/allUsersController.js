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
    getUserData,
    updateUserVerificationToken,
    verifyNewUser,
}=require("../services/allUserServices/userSignUp");

const {
    authenticate,
}=require("../services/allUserServices/userAuthentication");


const{
  sendEmailToNewUser,
  verifyToken,
  resendEmailToNewUser,
}=require("../services/emailServices/sendEmailAndVerify");


// loads website home page
exports.home_ui = asyncHandler(async (req, res, next) => {
 //if session varible for admin is 
 if (req.session.data!=undefined){
    if(req.session.data.role=='admin')// if admin has previously logged-in and the session had been saved
    {
       res.redirect("/admin/home");
    }
    else if(req.session.data.role=='user'){
      req.session.data.status='logged-in';
      let id=req.session.data.userid;
      res.redirect("/users/profile/"+id);

    }

 }
 else{
    //default website home page
    res.render("index", {});

 }

});

// users sign-in page
exports.signInPage=asyncHandler(async (req, res, next) => {
   // if prev user session is saved
   if (req.session.data!=undefined){
      if(req.session.data.role=='user')// redirect user to his profile
      {
        //if(req.session.data.status=='ready-to-login') // registered user logging in (session saved) do it later
        {
            req.session.data.status='logged-in';
            //let m='welcome back,'+req.session.data.firstname+'!';
            //res.render("", {welcome_msg:m});
            let id=req.session.data.userid;
            res.redirect("/users/profile/"+id);

        }
      }
      else if(req.session.data.role=='admin')// new user first ever login
      {
            /*req.session.data.status='logged-in';
            let m='welcome to your new account, '+req.session.data.firstname+'!';
            res.render("", {msg: m});*/

      }
   }
   else{
      //default sign-in page
      res.render("site_visitor_views/sign_in_page", {});
   }
    
});

//print func
const printObject=function(obj){
  console.log(obj);
}

// users sign-up page
exports.signUpPage=asyncHandler(async (req, res, next) => {
   res.render("site_visitor_views/sign_up_page", {}); //original page
});

// process user login
exports.signIn=[
  // Validate and sanitize the input fields. (server side form validation)
    //the email field
    body("email_field")
    .custom(async value => {
        validateEmail("email",value);
     }),
    //the email field
    body("password_field")
    .custom(async value => {
        validatePassword("password",value);
     }),
    
  asyncHandler(async (req, res, next) => {
     //Extract the validation errors from a request.
    const result = validationResult(req);//original code
    //const errors = result.array();
    //const errors = myValidationResult(req).array();
    const result2 = result.formatWith(error => error.msg);
    const errors2 = result2.array();
    // There are errors. Render the form again with sanitized values/error messages.
    if (!result.isEmpty()) {
            
      //for testing purpose only
      //res.status(500).json(errors2);
      //console.log("inside error");
      let errors=result.array();
      /*if(errors[0].msg=='display name field was empty')
      console.log("yes");*/
      let e1,e2;
      e1="";
      e2="";
      
      for (let x of errors){
        console.log(x);
        if(x.msg.startsWith("email"))
          e1=x.msg;
        else if(x.msg.startsWith("password"))
          e2=x.msg;
              
      }
      res.render("site_visitor_views/sign_in_page", {errors: result.array(),email_field_error:e1,password_field_error:e2, }); //original code
            //return;
    } 
    else
    {
        //Data from add ingred form is valid.
        let email=req.body.email_field.trim();
        let pwd=req.body.password_field;

        //authenticate the user
        const user_data=await  getUserData(res,email,false);
        let is_user_authenticated=await authenticate(user_data,pwd);
        console.log("awaiting return");
        let id=user_data.userId;
        printObject("req: "+req.session.data);
        if(is_user_authenticated) // to do: if req.session.data===undefined
        {
            if(req.session.data===undefined)
            {
              let loggedin_user_data = {role: "user",status: 'ready-to-login',firstname: user_data.username,userid:id, is_user_verified:user_data.isEmailVerified};
              req.session.data = loggedin_user_data;
              //session id accessible by req.session.id
              console.log(req.session.data);

            }
            
            //load user profile home page
            res.redirect("/users/profile/"+id);
        }
        //redirect user to profile

    }
   
}),
];


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
        console.log("Password valid: "+is_pwd_valid);
        if(is_pwd_valid) pwd=value;
     }),
    body("confirm_password_field")
    .custom(async value => {
        console.log("collected Password: "+pwd);
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
        // There are errors. Render the form again with sanitized values/error messages.
        if (!result.isEmpty()) {
            
            //for testing purpose only
            //res.status(500).json(errors2);
            console.log("inside error");
            let errors=result.array();
            /*if(errors[0].msg=='display name field was empty')
               console.log("yes");*/
            let e1,e2,e3,e4;
            e1="";
            e2="";
            e3="";
            e4="";
            for (let x of errors){
              console.log(x);
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
            //return;
        } 
        else
        {
          //Data from add ingred form is valid.
          let username=req.body.name_field.trim();
          let email=req.body.email_field.trim();
          //console.log("just before table");
          //checks that user table already exists.If not, create the table
          //console.log("length of email: "+email.length);
          const result1=await doesUserTableExist();
          
          if(result1=="user table exists")
          {
            //console.log("inside table exists");
            //check if username is already taken. if yes, give error message
            const result2=await checkUsername(res,username);
            if(result2=="username not taken")
            {
              //console.log("inside username");
              //check if email is already taken. if yes, give error message
              const result3=await checkUserEmail(res,email,false);
              if(result3=="email address not in database")
              {
                //console.log("inside email");
                //hashed the password before inserting it into db
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(pwd, salt);

                //generate id for new user
                let userid=uuidv4();
                
                //console.log("just before calling sending email function");
                //verify the user's email address 
                let token=await sendEmailToNewUser(userid,username,email,hashedPassword);


                if(token instanceof Error)
                {
                  res.render("site_visitor_views/sign_up_page", {registration_error:token});

                }
                else {
                  //insert new user info into database
                  let is_user_verified=false;
                  const msg=await registerNewUser(userid,username,email,hashedPassword,is_user_verified,token); 
                  //console.log(msg);
                  if(msg=="new user has been successfully added to database")
                  {
                     //redirect user to his personal homepage/dashboard
                     //res.render("site_visitor_views/sign_up_page", {registration_error:msg});
                     res.render("site_visitor_views/sign_up_page", {registration_error:'verification email sent to your email address. Please check it.'});

                  }
                  else{
                     res.render("site_visitor_views/sign_up_page", {registration_error:msg});
                  }
                  
                }

              }
            }

          }
          else{
            console.log(result1);
          }


        }  
        
    }),

];


//verify user token
exports.verifyNewUser=asyncHandler(async (req, res, next) => {
   //res.render("site_visitor_views/sign_up_page", {}); //original page
  const { token } = req.query;
  //const userId = req.params.userid;
  //console.log("token in verify "+token);
  //console.log(token);
  if(!token)  res.render("site_visitor_views/user_account_activation_page", {msg:'Token is required'});
  try {
    const decoded = await verifyToken(token);
    //verify new user
    let r=await verifyNewUser(res,decoded.emailid);

    //render page
    res.render("site_visitor_views/user_account_activation_page", {msg:'Email address successfully verified'});
    
  } catch (error) {
    //res.status(401).json({ error: "Invalid or expired token" });
    res.render("site_visitor_views/user_account_activation_page", {msg:error});
  }
   
});

//resend-verification email page
exports.resendVerficationEmailPage=asyncHandler(async (req, res, next) => {
  res.render("site_visitor_views/resend_verification_email", {});
});

//process resend-verification-email form
exports.resendVerficationEmail=[
  // Validate and sanitize the email address. (server side form validation)
  body("email_address")
    .custom(async value => {
        validateEmail("Email Id",value);
     }),
  //Process request after validation and sanitization.
  asyncHandler(async(req,res,next)=>{
        //Extract the validation errors from a request.
        const result = validationResult(req);//original code
        //const errors = result.array();
        //const errors = myValidationResult(req).array();
        const result2 = result.formatWith(error => error.msg);
        const errors2 = result2.array();
        // There are errors. Render the form again with sanitized values/error messages.
        if (!result.isEmpty()) {
            
            //for testing purpose only
            //res.status(500).json(errors2);
            
            let errors=result.array();
          
            let e1,e2,e3,e4;
            e1="";
            for (let x of errors){
              //console.log(x);
              if(x.msg.startsWith("Email"))
                e1=x.msg;
            }
            res.render("site_visitor_views/resend_verification_email", {registration_error:e1, }); //original code
            
        }
        else
        {
          //Data from form is valid.
          let email=req.body.email_address.trim();
          console.log(email+" "+email.length);
          //check if email is already in database
          const result3=await checkUserEmail(res,email,true);//(irrelevant)
          //if yes, check its verification status
          if(result3=="email address is in database")//(irrelevant)
          {
              //check if user email has already been verified
              //console.log(result3);
              let user_data=await getUserData(res,email,true);
              if(user_data.isEmailVerified===0)//not yet verified
              {
                //get userid,username,hashedpassword,token corresponding to this user email
                //resend email to user
                let token=await resendEmailToNewUser(user_data.userId,user_data.username,email,user_data.password,user_data.verificationToken);
                
                if(token instanceof Error)
                {
                  res.render("site_visitor_views/resend_verification_email", {registration_error:token});

                }
                //update token in db
                if(token!==user_data.verificationToken)
                {
                  //verify that it works
                  await updateUserVerificationToken(res,email,token);
                }
                else printObject("equal");


              }
              else if(is_user_verified===1)// user email already verified
              {
                res.render("site_visitor_views/resend_verification_email", {registration_error:'This user has already been verified', });
              }
              res.render("site_visitor_views/resend_verification_email", {registration_error:'verification email sent to your email address. Please check it.', });
              //console.log("user status: "+is_user_verified);

          }
          else if(result3=="email address not in database")
          {
            res.render("site_visitor_views/resend_verification_email", {registration_error:'Invalid credentials', });

          }
          
          
          
        }


    }),
];
