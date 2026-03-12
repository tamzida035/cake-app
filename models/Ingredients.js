// importing our database connection configuration
//const db=require('../config/database');//originial code

const{
    checkAdminPasswordExists,
    insertRecord,
    createTable
}=require("../utils/sql_functions");


// ingredient table schema
const IngredientSchema ="CREATE TABLE IF NOT EXISTS Ingredients (name VARCHAR(255) NOT NULL, status ENUM('Halal','Haram','Mushbooh'), alternative_ingredients JSON,PRIMARY KEY (name))";

//check if Ingredients table exists in database. If not,create it
const checkIngredientTableExists=function(cb){
 createTable(IngredientSchema,cb);
}
//this function inserts new ingredient into 'Ingredients' table of database.
//name: main ingredient name
//status: main ingredient status
//alt_ingred_list: a json object containing the alternative ingredients names
//cb: callback function
const insertIngredientInDB= function(name,status,alt_ingred_list,cb){
 //already created 'Ingredients' table by executing the following statement through command line Interface
 //CREATE TABLE Ingredients (name VARCHAR(255), status ENUM("Halal","Haram","Mushbooh"), alternative_ingredients JSON);// name column is primary key
 const insert_statement='INSERT INTO Ingredients (name,status,alternative_ingredients) VALUES (?,?,?)';
 insertRecord(insert_statement,[name,status,alt_ingred_list],cb);
 //prev code
 /*return new Promise((resolve, reject) => {
 	
 	const promise = db.promise();
 	db.execute(insert_statement,[name,status,alt_ingred_list],function(err,result){
 		if (err) {
 			console.log("reject: "+reject(err));
 			//db.close();
            reject(err);// returns undefined dont know why
            
        } else {
           resolve('Ingredient has been successfully added to database.');
        }

 	});
 	console.log("close connection");
 	//db.close();//gives error
 	//db.release();//gives error
 	//db.end();//gives error
});*/
 	 
 	//(works successfully)
 	/*db.getConnection().then( conn => {
         conn.execute(insert_statement,[name,status,alt_ingred_list])
         .then(r => {
                conn.release();
                //console.log(r[0]);
                if(cb)
                {
		    cb("successful data insertion");
		  }
            })
         .catch(err => {
                conn.release();
                //conn.release();
                //console.log(err.code);
                if(cb){
		    cb(err.code);
		  }
			
            });
 	});*/

}

const trialFunc= function(){
 return new Promise((resolve, reject) => {
 	//const insert_statement='INSERT INTO Ingredients (name,status,alternative_ingredients) VALUES (?,?,?)';
 	const promise = db.promise();
});
}


//module.exports=insertIngredient;//original code
module.exports={
	insertIngredientInDB,
    checkIngredientTableExists,
};