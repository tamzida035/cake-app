const{
    insertRecord,
    createTable,
    checkRecordExists,
    getRecord,
    updateRecord,
    updateRecord2,
}=require("../utils/sql_functions");

// user table schema
const UserSchema ="CREATE TABLE IF NOT EXISTS Users (userId VARCHAR(255) NOT NULL,username VARCHAR(255) UNIQUE NOT NULL,email VARCHAR(255) UNIQUE NOT NULL,password VARCHAR(255) NOT NULL,isEmailVerified BOOLEAN DEFAULT FALSE,verificationToken VARCHAR(400), PRIMARY KEY (userId))";

//function checks if Users table exists in database. If not,create it
const checkUserTableExistsInDB=function(cb){
 createTable(UserSchema,cb);
}

//function checks if given username exists in user table Of database
//name: display name of user
//cb: callback function(irrelevant)
const checkUsernameInDB= function(name,cb){
 const query='SELECT username FROM Users WHERE username=(?)';
 //performs query in database table
 checkRecordExists(query,[name],cb);
}


//function checks if given user email address exists in user table Of database
//email: user email address
//cb: callback function
const checkUserEmailInDB= function(email,cb){
 const query='SELECT email FROM Users WHERE email=(?)';
 //performs query in database table
 checkRecordExists(query,[email],cb);
}

//function inserts new user in user table Of database
//userid: user id 
//username: user display name
//email: user email address
//hashedPassword: bycrypted user password
//is_verified_user: true if user email has been veriified else false
//token: email verification token
//cb: callback function
const insertNewUserInDB= function(userid,username,email,hashedPassword,is_verified_user,token,cb){
 //const query='SELECT email FROM Users';
 const query='INSERT INTO Users (userId,username,email,password,isEmailVerified,verificationToken) VALUES (?,?,?,?,?,?)';
  //performs query in database table
 insertRecord(query,[userid,username,email,hashedPassword,is_verified_user,token],cb);
}

//function to retrieve user verification status of a given email id
//email: user email address to be verified
//cb: callback function
const getUserDataInDB= function(email,cb){
 const query='SELECT * FROM Users WHERE email=(?)';
  //performs query in database table
 getRecord(query,[email],cb);
}

//function to update user verification token of a given email id
//email2: user email address to be verified
//token: token generated for email verification link
//cb: callback function
const updateUserVerificationTokenInDB= function(email2,token,cb){
 //const query='UPDATE Users SET verificationToken=(?) WHERE email=(?)';//previously worked
 const query='UPDATE Users SET verificationToken =? WHERE email=?';
 //performs query in database table
 updateRecord(query,[token,email2],cb);//orgiginl
 //updateRecord2(query,token,email2,cb);//(works)
}

//function to update user verification daata of a given email id
//email: user email address to be verified
//cb: callback function
const updateUserVerificationDataInDB= function(email,cb){
 //const query='UPDATE Users SET verificationToken=NULL,isEmailVerified=1 WHERE email=(?)';//orgiginl
 const query='UPDATE Users SET verificationToken=NULL,isEmailVerified=1 WHERE email=?';
 //performs query in database table
 updateRecord(query,[email],cb);//orgiginl
 //updateRecord(query,email,cb);
}


module.exports={
    checkUserTableExistsInDB,
    checkUsernameInDB,
    checkUserEmailInDB,
    insertNewUserInDB,
    getUserDataInDB,
    updateUserVerificationTokenInDB,
    updateUserVerificationDataInDB,
};