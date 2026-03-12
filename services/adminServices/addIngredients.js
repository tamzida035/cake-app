const {
    insertIngredientInDB,
    checkIngredientTableExists,
}=require("../../models/Ingredients");


//function checks first if the Ingredients table exists. if so, adds ingredient to database else gives error messages
//main_ingredient:main ingredient name
//main_ingred_status: main ingredient status
//alt_list: a json object containing the alternative ingredients names
//return: promise
const addIngredients= function(main_ingredient,main_ingred_status,alt_list){
    return new Promise((resolve, reject) => {
        //check that ingredient table already exists
        checkIngredientTableExists(function(results){
          if(results=="ER_CANT_CREATE_TABLE")
          {
                //table("Ingredient has been successfully added to database.");
                //resolve(results);
                reject(results);
 
          }
        });
        insertIngredientInDB(main_ingredient,main_ingred_status,alt_list,function(results){
            if(results=='successful data insertion')
            {
                resolve("Ingredient has been successfully added to database.");

            }
            else if(results=="ER_DUP_ENTRY")
            {
                reject("main ingredient already exists in database.");
            }
            else{
                reject("Failed to connect to database");
            }
        });
    });

};

module.exports={
    addIngredients
};