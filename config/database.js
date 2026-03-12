//importing dotenv package to share contents of .env file
require("dotenv").config();

//middleware for interacting with mysql
//const mysql=require('mysql2');//original code
const mysql = require('mysql2/promise');


//password for accessing the database which is saved in a private .env file
const password=process.env.CASUAL_PASS; // empty string
const pool=mysql.createPool({
		host: process.env.HOST,
		user: 'root',
		database: 'cake_app',
		password: password,
		waitForConnections: true,
		connectionLimit: 10,
		queueLimit: 0
});


//configuring db connection
//already done the following through command line Interface
//CREATE DATABASE IF NOT EXISTS cake_app;
//original code (not needed)
/*const connection=mysql.createConnection({
	host: 'localhost',
	user: 'root',
	database: 'cake_app', // already created from command line
	password: password,
});

// Connect to the MySQL database (original code) (not needed)
connection.connect((err) => {
	if (err) {
		console.error('Error connecting to the database: ' + err.stack);
		return;
	}
	console.log('Connected to the database as ID ' + connection.threadId);
});*/


//original code(not needed)
//module.exports=connection;


//configuring db connection
/*const pool=mysql.createPool({
		host: 'localhost',
		user: 'root',
		database: 'cake_app',
		password: password,
		waitForConnections: true,
		connectionLimit: 10,
		queueLimit: 0
});*/

//verify connection
/*pool.getConnection((err,connection)=>{
		if(err){
			console.log({error:err.msg});
		}
		console.log("connected to mysql");
		connection.release();

});*/


//interacting with db
module.exports=pool;
