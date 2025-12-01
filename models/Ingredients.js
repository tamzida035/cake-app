// importing our database connection configuration
const db=require('../util/database');

//check if ingredient already exists in table

// insert new ingredient into 'Ingredients' table of database. Note: 1st create this table
const insertIngredient= function(name,status,alt_ingred_list){
 //already created 'Ingredients' table by executing the following statement through command line Interface
 //CREATE TABLE Ingredients (name VARCHAR(255), status ENUM("Halal","Haram","Mushbooh"), alternative_ingredients JSON);// name column is primary key
 return new Promise((resolve, reject) => {
 	const insert_statement='INSERT INTO Ingredients (name,status,alternative_ingredients) VALUES (?,?,?)';
 	db.query(insert_statement,[name,status,alt_ingred_list],function(err,result){
 		if (err) {
 			//console.log("reject: "+reject(err));
            reject(err);// returns undefined dont know why
            //console.log("stuck here");
        } else {
           resolve('success');
        }

 	});
 });
 /*const insert_statement='INSERT INTO Ingredients (name,status,alternative_ingredients) VALUES (?,?,?)';
 db.query(insert_statement,[name,status,alt_ingred_list],function(err,cb,result){
		if(err){
			// TO DO: give pug template here
			//console.error(err.message);
		}
		else{
			console.log("Ingredients data successfully inserted ");
			//cb(result);		
					
		}
		//Return a resolved Promise even if userId is absent
  		return Promise.resolve(null);

	});*/
}

const foo=function(name,status,alt_ingred_list){
	console.log("Random function");
}

module.exports=insertIngredient;