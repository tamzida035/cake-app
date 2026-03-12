const{
    insertRecord,
    createTable,
    checkRecordExists
}=require("../utils/sql_functions");

// user table schema
const UserSchema ="CREATE TABLE IF NOT EXISTS Users (userId VARCHAR(255) NOT NULL,username VARCHAR(255) UNIQUE NOT NULL,email VARCHAR(255) UNIQUE NOT NULL,password VARCHAR(255) NOT NULL, PRIMARY KEY (userId))";

//function checks if Users table exists in database. If not,create it
const checkUserTableExistsInDB=function(cb){
 createTable(UserSchema,cb);
}

//function checks if given username exists in user table Of database
//name: display name of user
//cb: callback function
const checkUsernameInDB= function(name,cb){
 const query='SELECT username FROM Users';
 //performs query in database table
 checkRecordExists(query,[name],cb);
}


//function checks if given user email address exists in user table Of database
//email: user email address
//cb: callback function
const checkUserEmailInDB= function(email,cb){
 const query='SELECT email FROM Users';
  //performs query in database table
 checkRecordExists(query,[email],cb);
}

//function inserts new user in user table Of database
//userid: user id 
//username: user display name
//email: user email address
//hashedPassword: bycrypted user password
//cb: callback function
const insertNewUserInDB= function(userid,username,email,hashedPassword,cb){
 //const query='SELECT email FROM Users';
 const query='INSERT INTO Users (userId,username,email,password) VALUES (?,?,?,?)';
  //performs query in database table
 insertRecord(query,[userid,username,email,hashedPassword],cb);
}

module.exports={
    checkUserTableExistsInDB,
    checkUsernameInDB,
    checkUserEmailInDB,
    insertNewUserInDB,
};