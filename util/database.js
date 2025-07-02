//importing dotenv package to share contents of .env file
require("dotenv").config();

//middleware for interacting with mysql
const mysql=require('mysql2');

//password for accessing the database which is saved in a private .env file
const password=process.env.CASUAL_PASS;

//configuring db connection
//already done the following through command line Interface
//CREATE DATABASE IF NOT EXISTS cake_app;
const connection=mysql.createConnection({
	host: 'localhost',
	user: 'root',
	database: 'cake_app', // already created from command line
	password: password,
});

// Connect to the MySQL database
connection.connect((err) => {
	if (err) {
		console.error('Error connecting to the database: ' + err.stack);
		return;
	}
	console.log('Connected to the database as ID ' + connection.threadId);
});

module.exports=connection;
//configuring db connection
/*const pool=mysql.createPool({
		host: 'localhost',
		user: 'root',
		database: 'cake_app',
		password: password,
});

//verify connection
pool.getConnection((err,connection)=>{
		if(err){
			console.log({error:err.msg});
		}
		console.log("connected to mysql");
		connection.release();

});*/



/*const pool=mysql.createPool({
	host: 'localhost',
	user: 'root',
	database: 'cake_app',
	password: password,
});*/

//interacting with db
//module.exports=pool;
