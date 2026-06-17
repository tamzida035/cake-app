const {
    getUserData,
}=require("./userSignUp");

// hash the password
const bcrypt = require("bcryptjs");

//function auuthenticates a registered user by comparing admin entered password with that stored in the database.If passwords do not match or email non existent, gives error
//res: response object
//typed_password: password entered by user
//user_credentials: promise containing user credentials
//return: promise
const authenticate= function(res,user_credentials,typed_password){
 
 return new Promise((resolve, reject) => {
        
        //let user_credentials= getUserData(res,typed_email,false);
        console.log("inside auth: "+user_credentials);
        if(user_credentials==="this value is not in database")
        {
          //for testing purpose only
          res.status(500).json("This email id does not exist");
          //res.render("site_visitor_views/sign_in_page", {errors: result.array(),email_field_error:'This email id does not exist', });
        }
        else{
        	
        	 bcrypt.compare(typed_password,user_credentials.password, function(err, is_matched) {
        	 	if(err)
            {
              //console.log("I am here authen");
              res.render("site_visitor_views/sign_in_page", {password_field_error:err, });
                  //reject(err);
            }
            else if(is_matched==true)
            {
                  console.log("inside check: "+is_matched);
                  //resolve(user_credentials);
                  resolve(is_matched);
                  //return user_credentials;

            }
            else 
            { 
               //for testing purpose only
               res.status(500).json("incorrect email/password");

               res.render("site_visitor_views/sign_in_page", {password_field_error:'incorrect email/password', });
                  //res.render("site_visitor_views/sign_in_page", {errors: result.array(),password_field_error:'incorrect password', });
            }

            });
          
        }  

});
}



module.exports={
	authenticate,
};