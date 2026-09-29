const {
    getIngredientsFromDB,
    checkIngredientTableExists,
}=require("../../models/Ingredients");

//function checks first if the Ingredients table exists. if so, retrieve all ingredients from database else give error messages
//return: promise
const getAllIngredients= function(){
    return new Promise((resolve, reject) => {
        //check that ingredient table already exists
        console.log("inside getAllIngredients");
        checkIngredientTableExists(function(results){
          if(results instanceof Error)
          {
                //resolve(results);
                reject(results);
 
          }
        });
        getIngredientsFromDB(function(results){
        	if(results instanceof Error){
        		reject(results);
        	}
            else 
            {
                resolve(results);

            }
            
        });
    });

};

module.exports={
    getAllIngredients,
};