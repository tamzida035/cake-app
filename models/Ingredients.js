// importing our database connection configuration
const db=require('../util/database');//originial code

//check if ingredient already exists in table

// insert new ingredient into 'Ingredients' table of database. Note: 1st create this table
const insertIngredient= function(name,status,alt_ingred_list,cb){
 //already created 'Ingredients' table by executing the following statement through command line Interface
 //CREATE TABLE Ingredients (name VARCHAR(255), status ENUM("Halal","Haram","Mushbooh"), alternative_ingredients JSON);// name column is primary key
 const insert_statement='INSERT INTO Ingredients (name,status,alternative_ingredients) VALUES (?,?,?)';
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
 	db.getConnection().then( conn => {
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
                conn.release();
                //console.log(err.code);
                if(cb){
				  cb(err.code);
			    }
			
            });
 	});

}

const trialFunc= function(){
 return new Promise((resolve, reject) => {
 	//const insert_statement='INSERT INTO Ingredients (name,status,alternative_ingredients) VALUES (?,?,?)';
 	const promise = db.promise();
});
}


//module.exports=insertIngredient;//original code
module.exports={
	insertIngredient,
	trialFunc,
};