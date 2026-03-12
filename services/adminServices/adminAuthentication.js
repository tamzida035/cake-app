const{
    checkAdminPasswordInDB,
    adminSchema,
    checkAdminPasswordTableExists
}=require("../../models/adminLogin");

// hash the password
const bcrypt = require("bcryptjs");



//function checks first if the adminpassword table exists. if so,compares admin entered password with that stored in the database.If passwords do not match, gives error
//res: response object
//typed_password: password entered by admin
//return: promise
const authenticate= function(res,typed_password){
 
 return new Promise((resolve, reject) => {
        //check that admin password table already exists
        checkAdminPasswordTableExists(function(results){
          if(results=="ER_CANT_CREATE_TABLE")
          {
                //table("Ingredient has been successfully added to database.");
                //resolve(results);
                reject(results);
 
          }
        });
        //get password from database
        checkAdminPasswordInDB(function(results){
          //decrypt the password in the database before comparing it with user entered password
          bcrypt.compare(typed_password, results[0][0].password, (err, is_matched) => {
          if(err)
          {
              //console.error('Error comparing passwords: ' + err);// to do: put error template here
              reject(err);
          }
          else if(is_matched)
          {
              //console.log("inside check: "+is_matched);
              resolve(is_matched);

          }
          else{
              //console.log('Password is incorrect');
              res.render("admin_views/admin_login_page", {msg: 'You have entered wrong password.'});
              return;

          }
          });
             
        });

});
}



module.exports={
	authenticate,
};