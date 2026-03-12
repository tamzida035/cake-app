const {
    checkUserTableExistsInDB,
    checkUsernameInDB,
    checkUserEmailInDB,
    insertNewUserInDB,
}=require("../../models/Users");

//function checks that user table already exists.If not, create the table
const doesUserTableExist= function(){
	return new Promise((resolve, reject) => {
	 checkUserTableExistsInDB(function(results){
          //console.log("results: "+results);
          if(results=="table exists"){
          	resolve("user table exists");

          }
          else{
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
            if(results=="this value is already in database")
            {
                res.render("site_visitor_views/sign_up_page", {name_field_error: 'This username already exists. Try a new username.'});

            }
            else if(results=="this value is not in database")//correct it
            {
                resolve("username not taken");
            }
            else{
            	res.render("site_visitor_views/sign_up_page", {name_field_error: results});
            }
        });
    });

};

//function checks if given user email address exists in user table. If so, gives error message
//res: response object
//email: user email address
//return: promise
const checkUserEmail= function(res,email){
    return new Promise((resolve, reject) => {
        checkUserEmailInDB(email,function(results){
            if(results=="this value is already in database")
            {
                res.render("site_visitor_views/sign_up_page", {email_field_error: 'This username already exists. Try a new username.'});

            }
            else if(results=="this value is not in database")//correct it
            {
                resolve("email address not taken");
            }
            else{
            	res.render("site_visitor_views/sign_up_page", {email_field_error: results});
            }
        });
    });

};

//function registers new user. on failure gives error messages
//userid: user id 
//username: user display name
//email: user email address
//hashedPassword: bycrypted user password
//return: promise
const registerNewUser= function(userid,username,email,hashedPassword){
    return new Promise((resolve, reject) => {
        insertNewUserInDB(userid,username,email,hashedPassword,function(results){
        	console.log("results: "+results);
            if(results=='successful data insertion')
            {
                resolve("new user has been successfully added to database");

            }
            else
            {
            	//res.render("site_visitor_views/sign_up_page", {confirm_password_field_error:results});
                reject(results);
            }
           
        });
    });

};

//function to activate new user account
//email: user email address to verify
//userid: user id 
//username: user display name
//hashedPassword: bycrypted user password
const verifyUserEmailId= function(userid,username,email,hashedPassword){
    return new Promise((resolve, reject) => { 
    	
    });

};
module.exports={
    checkUsername,
    doesUserTableExist,
    checkUserEmail,
    registerNewUser,
    verifyUserEmailId,
};