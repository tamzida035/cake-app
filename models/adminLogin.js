// importing our database connection configuration
const db=require('../util/database');//originial code

// hash the password
const bcrypt = require("bcryptjs");

//check if admin has entered correct password
const checkAdminPassword=function(cb){
	//already done the following through command line Interface
	//create table AdminPassword (password VARCHAR(255));

	//const hash='$2b$10$hYKYgFBeTY.r2vPPxAYpdO0WQQhxgc4hgLN9GukMOiIf9QPZld4Fy';
	//const select_q=('SELECT password FROM AdminPassword WHERE password=?');
	//db.query(select_q,hash,function(err,result)
    // code 3: works correctly
	const q=('SELECT password FROM AdminPassword');
    db.getConnection().then( conn => {
         conn.query(q)
         .then(r => {
                conn.release();
                console.log(r[0][0]);
                if(cb)
                {
					cb(r);
				}
            })
         .catch(err => {
                conn.release();
                console.log('Error fetching users from the database: ' + err.stack);
                if(cb){
				  cb(err);
			    }
			
            });
 	});
    
	/*//originial code 2 (actual code)
	const promise = db.promise();

	db.execute(q,function(err,result){
		if(err){
			// TO DO: give pug template here
			console.error('Error fetching users from the database: ' + err.stack);
			
		}
		else{
			if(cb){
				cb(result);	
			}
						
		}

	});*/

	//originial code 1(not needed)
	/*db.query(q,function(err,result){
		if(err){
			// TO DO: give pug template here
			console.error('Error fetching users from the database: ' + err.stack);
			db.destroy();
			
		}
		else{
			if(cb){
				//console.log("admin pass: "+result[0].password);
				//db.destroy();
				cb(result);	
				db.destroy();
				//return true;
			}
						
		}

	});*/
}

//NOTE:this func insert hashed admin password into the db. It has been executed only once and need not be executed further
const insertHashedPassword=function(hashedPassword){
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
}
module.exports={
	checkAdminPassword,
	insertHashedPassword,
	deletePassword,
};
