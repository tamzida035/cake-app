// importing our database connection configuration
const db=require('../config/database');//original code(not needed)

const{
    checkAdminPasswordExists,
	insertRecord,
	createTable
}=require("../utils/sql_functions");



// admin password table schema
const adminSchema ="CREATE TABLE IF NOT EXISTS AdminPassword (password VARCHAR(255))";

//check if AdminPassword table exists in database. If not,create it
const checkAdminPasswordTableExists=function(cb){
 createTable(adminSchema,cb);
}

//function retrieving admin password from database
//cb: callback function
//return: retrieved password
const checkAdminPasswordInDB=function(cb){
	const q=('SELECT password FROM AdminPassword');
	checkAdminPasswordExists(q,cb);

}
//NOTE:this func insert hashed admin password into the db. It has been executed only once and need not be executed further
/*const insertHashedPassword=function(hashedPassword){
	const insert_statement='INSERT INTO AdminPassword (password) VALUES (?)';
	//const value=[hashedPassword];
	//console.log("problem is here "+ hashedPassword);
	//const insert_q = mysql.format(insert_statement,[hashedPassword]);
	db.query(insert_statement,hashedPassword,function(err){
		if(err){
			console.error(`Error while inserting hashed password (in adminLogin.js) `, err.message);
		}
		else{
			console.log("hashed password successfully inserted");


		}
			

	});
	
}

// DELETE THIS CODE:
const deletePassword=function(){
	const pass='abc123';
	const delete_q=('DELETE FROM AdminPassword WHERE password=?');
	db.query(delete_q,pass,function(err){
		if(err){
			console.error(`Error while deleting unhashed password `, err.message);
		}
		else
		{
			console.log("unhashed password successfully deleted");

		}

	});
}*/
module.exports={
	checkAdminPasswordInDB,
	checkAdminPasswordTableExists
};
