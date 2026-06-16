const {
    checkTableExistsInDB,
    checkUsernameInDB,
    checkUserEmailInDB,
    insertNewUserInDB,
    getUserDataInDB,
    checkUserIdInDB,
    updateUserVerificationTokenInDB,
    updateUserVerificationDataInDB,
}=require("../../models/Users");

//function checks that user table already exists.If not, create the table
const doesUserTableExist= function(){
	return new Promise((resolve, reject) => {
	 checkTableExistsInDB(function(results){
          //console.log("results: "+results);
          if(results=="table exists"){
          	resolve("user table exists");

          }
          else{
            //console.log("usersign: "+results);
          	reject(results);
          }
        });
    });
}

//function checks if given username exists in user table. If so, gives error message
//res: response object
//username: display name of user
//return: promise
const checkUsername= function(res,username){
    return new Promise((resolve, reject) => {
        checkUsernameInDB(username,function(results){
            if(results==="this value is already in database")
            {
                //for testing purpose only
                //res.status(500).json(results);
                res.render("site_visitor_views/sign_up_page", {name_field_error: 'This username already exists. Try a new username.'});

            }
            else if(results==="this value is not in database")//correct it
            {
                resolve("username not taken");
            }
            else{
            	//console.log("go");
            	res.render("site_visitor_views/sign_up_page", {name_field_error: results});
            }
        });
    });

};

//function checks if given user email address exists in user table. If so, gives error message
//res: response object
//email: user email address
//is_resend_email: true for resending verfication email else false
//return: promise
const checkUserEmail= function(res,email,is_resend_email){
    return new Promise((resolve, reject) => {
        checkUserEmailInDB(email,function(results){
            //console.log("checkUserEmail "+results);
            //let r=JSON.stringify(results);
            //let itemPair = JSON.parse(r);
            //console.log(itemPair);

            if(results=="this value is already in database")
            {
                if(is_resend_email===true)
                {
                    resolve("email address is in database");
                }
                else
                {
                    //for testing purpose only
                    //res.status(500).json(results);
                    res.render("site_visitor_views/sign_up_page", {email_field_error: 'This username already exists. Try a new username.'});
                }

            }
            else if(results=="this value is not in database")//correct it
            {
                if(is_resend_email===true)
                {
                    res.render("site_visitor_views/resend_verification_email", {registration_error:'This email address does not exist in database', });

                }
                else resolve("email address not in database");
            }
            else{
                if(is_resend_email===true)
                {
                    res.render("site_visitor_views/resend_verification_email", {registration_error:results, });

                }
            	else res.render("site_visitor_views/sign_up_page", {email_field_error: results});
            }
        });
    });

};

//function registers new user. on failure gives error messages
//userid: user id 
//username: user display name
//email: user email address
//hashedPassword: bycrypted user password
//is_verified_user: true if user email has been veriified else false
//token: email verification token
//return: promise
const registerNewUser= function(userid,username,email,hashedPassword,is_verified_user,token){
    return new Promise((resolve, reject) => {
        insertNewUserInDB(userid,username,email,hashedPassword,is_verified_user,token,function(results){
        	//console.log("results: "+results);
            if(results=='successful data insertion')
            {
                resolve("new user has been successfully added to database after sending email");

            }
            else
            {
            	//res.render("site_visitor_views/sign_up_page", {confirm_password_field_error:results});
                reject(results);
            }
           
        });
    });

};

//function checks if given user id exists in user table. If so, gives error message
//res: response object
//userid: user id
const checkUserId= function(userid){
    return new Promise((resolve, reject) => { 
         checkUserIdInDB(userid,function(results){
            //console.log("userid in checkUserId: "+userid);
            console.log("WHY get wrong res: "+results);
            if(results==="this value is already in database")
            {
                
                //for testing purpose only
                //res.status(500).json(results);
                //res.render("site_visitor_views/sign_up_page", {name_field_error: 'This username already exists. Try a new username.'});
                resolve(results);

            }
            else if(results==="this value is not in database")//correct it
            {
                let e=new Error("this userid no longer exists");
                reject(e);
                //throw new Error("this userid no longer exists");
            }
            else{
                //other type of error occurred
                let e=new Error(results);
                reject(e);

            }
        });
    	
    });

};

//function to verify if a user email address has already been verified
//email: user email address to verify
//res: response object
//is_resend_email: true for resending verfication email else false
// return: promise returning user verification status or if error occurs displays error
const getUserDataByEmail=function(res,email,is_resend_email){
    return new Promise((resolve, reject) => { 
        getUserDataInDB(email,function(results){
            //console.log("outside result: "+results.email);
            if(results instanceof Error){
                //console.log("Wrong!");
                if(is_resend_email===false)
                {
                    res.render("site_visitor_views/sign_in_page", {password_field_error:results, });
                }
                else res.render("site_visitor_views/resend_verification_email", {registration_error:results, });

            }
            else{
                //console.log(results.isEmailVerified);
                resolve(results);
            }
        });
    });
};

// function to update user verification token
//email: user email address to verify
//res: response object
//token: token generated for email verification link
//return: promise returning user verification status or if error occurs displays error
const updateUserVerificationToken=function(res,email,token){
    return new Promise((resolve, reject) => { 
        updateUserVerificationTokenInDB(email,token,function(results){
            //data cannot be inserted due to error
            if(results instanceof Error){
                //console.log("Wrong!");
                res.render("site_visitor_views/resend_verification_email", {registration_error:results,});

            }
            else{
                //successful data insertion
                resolve(results);
            }
        });
    });
};

// function to verify new user with given user id
//userid: user id to verify
//res: response object
//return: promise returning succesful data update if error occurs displays error
const verifyNewUser=function(res,userid){
    return new Promise((resolve, reject) => { 
        updateUserVerificationDataInDB(userid,function(results){
            //resolve(results);
            //data cannot be inserted due to error
            if(results instanceof Error){

                let e=new Error('Failed to verify user email.Try again later.');
                reject(e);
                //res.render("site_visitor_views/user_account_activation_page", {msg:'Failed to verify user email. Try again later.'});
                //res.render("site_visitor_views/resend_verification_email", {registration_error:results, });

            }
            else{
                //successful data insertion
                resolve(results);
            }
        });
    });
};

module.exports={
    checkUsername,
    doesUserTableExist,
    checkUserEmail,
    registerNewUser,
    getUserDataByEmail,
    updateUserVerificationToken,
    checkUserId,
    verifyNewUser,
};