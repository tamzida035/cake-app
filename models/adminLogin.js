// importing our database connection configuration
const db=require('../util/database');

const checkAdminPassword=function(cb){
	//already done the following through command line Interface
	//create table AdminPassword (password VARCHAR(255));
    //CREATE DATABASE IF NOT EXISTS cake_app;
	const q=('SELECT password FROM AdminPassword');
	db.query(q,function(err,result){
		if(err){
			// give pug template here
			console.error('Error fetching users from the database: ' + error.stack);
		}
		else{
			if(cb)
				cb(result);		
		}

	});
}

module.exports={
	checkAdminPassword,
};
