// this file contains all endpoints accessible by registered users
let express = require('express');
let router = express.Router();
const{
    isVerifiedUser,
}=require('../middleware/userMiddleware');


// Require registered user controller (not sure if need to modify this)
const user_controller = require("../controllers/usersController");

//add new recipe page load
router.get("/add_new_recipe_by_voice",user_controller.addNewVoiceRecipePage);

//route where client sends request to server to get ingredients list from database
router.get("/get_all_ingredients",user_controller.getIngredients);
//router.get("/get_ingredients",user_controller.getIng);

//process newly added voice recipe(TO DO)
router.post("/add_new_recipe_by_voice",user_controller.processNewVoiceRecipe);



//load add new recipe page load
//router.gett("/add_new_recipe_by_voice",user_controller.addNewRecipeByVoice);

// users personal home page
//router.get("/profile/:userid",isVerifiedUser,user_controller.profile); //make it work
router.get("/profile/:userid",user_controller.profile);//--->Important : update architecture diagam about this route

//user sign out route
router.get("/profile/:id/logout",user_controller.signOut);

//add new recipe page load
//router.get("/add_new_recipe_by_voice",user_controller.addNewRecipePage);




//router.post("/example",user_controller.addNewRecipeByVoice);
module.exports = router;
