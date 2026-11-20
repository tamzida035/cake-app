// purpose: provides a wrapper to catch exceptions thrown in route handler functions.
const asyncHandler = require("express-async-handler");

//importing dotenv package to share contents of .env file
let dotenv=require("dotenv").config();

const session_name=process.env.SESSIONCOOKIENAME;


const {
    logOut,
}=require("../services/userServices/userLogOut");

const {
    getAllIngredients,
}=require("../services/userServices/getIngredients");

const { body, check, validationResult } = require("express-validator");

const{
    validateText,
    validateNumber,
}=require("../validators/commonValidators");

const{
    isTimeValid,
}=require("../validators/timeValidators");


const{
  multer,
  imageUploaded,
}=require("../middleware/uploadMiddleware");


// load user personal profile page
exports.profile = asyncHandler(async (req, res,next) => {
  //if session does not exist
  /*if (req.session.data===undefined){
  	res.render("error_views/unauthorized_access", {error_msg:'login to access this page!'});

  }
  else{
  	if(req.session.data.role=='user')
  	{
  		if(req.session.data.is_user_verified==0)
  		{
  			res.render("error_views/unauthorized_access", {error_msg:'your account is not verified.please verify it.'});
  		}
  		else
  		{
        const { userid } = req.params;
        console.log("user id outside:"+ userid);
  			if(req.session.data.status=='ready-to-login')
        {
          req.session.data.status='logged-in';

          console.log("user id is:"+ userid);
          res.render("user_views/user_home", {welcome_msg:'show login success alert',user:req.session.data.firstname,userid:userid,});
        }
        else
        {
          
          res.render("user_views/user_home",{welcome_msg:'',userid:userid,});
        } 
  		}

  	}
  	else res.render("error_views/unauthorized_access", {error_msg:'only verified user is allowed access !'});
  }*/
  const { userid } = req.params;
  //console.log("user id outside:"+ userid);
  if(req.session.data.status=='ready-to-login')
  {
    req.session.data.status='logged-in';
    console.log("user id is:"+ userid);
    res.render("user_views/user_home", {welcome_msg:'show login success alert',user:req.session.data.firstname,userid:userid,});
  }
  else res.render("user_views/user_home",{welcome_msg:'',userid:userid,});
  
});

//user sign out
exports.signOut = asyncHandler(async (req, res, next) => {
    logOut(req,res,session_name);
    //original code
    /*req.session.destroy(function(err) {
    if (err) {
      //res.send('An err occured: ' +err.message);
      res.render("admin_views/admin_login_page", {error_msg:err.message});
    } else {
      var message = 'You have been successfully logged out';
      res.status(200).clearCookie(session_name).redirect('/');
    }
})*/
});

//load add new recipe by voice page (GET)
exports.addNewVoiceRecipePage = asyncHandler(async (req, res,next) => {
 
  console.log("I arrived at: "+req.params.userid);
  res.render("user_views/add_new_voice_recipe", {userid:req.params.userid, });

});


//process new voice recipe (POST) (rough)
exports.processNewVoiceRecipe =[
    asyncHandler(async (req, res,next) => {
      
      imageUploaded(req, res, (err) => {
        console.log("logged in user id "+req.params.userid);
        
        if (err) 
        {
          let photo_error;
          if (err instanceof multer.MulterError) {
            //console.log(err.message);
            photo_error=err.message;

          }
          else if(err instanceof Error)//for forbidden file extension
          {
           // console.error("err: "+err);
            photo_error=err.message;
          }
          else photo_error=err;
          //immediately inform user that his photo could not be uploaded
          console.log("photo_error: "+photo_error);
          
          res.json({photos_field_error:photo_error});
        }
        else
        {
          let recipe_name,photo,servings,prep_time,cook_time,total_time;
          let equp_arr=new Array();
          let ingredients_list,recipe_steps,notes;
          //photo file
          photo=req.file; //if !req.file no photo uploaded else uploaded
          /*if (!req.file) {//uploading image is optional for private recipes
           console.log('No photo uploaded');
            //is_image_uploaded=false;
          }
          else
          {
            photo=req.file;
            //is_image_uploaded=true;
            console.log('photo successfully uploaded');
          
          }*/
          //console.log("req.recipe_name_field 2 "+req.body.recipe_name_field);
          //Validate and sanitize the other input fields
          let recipe_name_err,serving_err,prep_time_err,cooking_time_err,total_time_err,note_err,is_err;
          is_err=false;

          //validate the recipe_name field
          let recipe_name_format = /^[a-zA-Z ]{3,25}$/;
          let MIN_RECIPE_NAME_LENGTH=3;
          let MAX_RECIPE_NAME_LENGTH=25;
          console.log("value of name in controller: "+req.body.recipe_name_field);
          try{
            recipe_name_err="";
            validateText("Recipe name",req.body.recipe_name_field,MIN_RECIPE_NAME_LENGTH,MAX_RECIPE_NAME_LENGTH,recipe_name_format);
            recipe_name=req.body.recipe_name_field.trim();
            //console.log("max_length:"+req.body.recipe_name_field.maxLength);undefined
          }
          catch(err)
          {
            recipe_name_err=err.message;
            is_err=true;
            console.log("err: "+recipe_name_err);
          }

          //validate the serving field
          let MIN_SERVING_NO=1;
          console.log("value of serve in controller: "+req.body.serve_field);
          try{
            serving_err="";
            validateNumber("serving field",req.body.serve_field,MIN_SERVING_NO);
            servings=req.body.serve_field;
            //console.log("minm no:"+req.body.recipe_name_field.min);
          }
          catch(err)
          {
            serving_err=err.message;
            is_err=true;
            console.log("err: "+serving_err);
          }

          //validate the preparation time field
          try{
            prep_time_err="";
            isTimeValid(req.body.prep_time_field,"preparation time field");
            prep_time=req.body.prep_time_field;
          }
          catch(err)
          {
            prep_time_err=err.message;
            is_err=true;
            console.log("err: "+prep_time_err);
          }

          //validate the cooking time field
          try{
            cooking_time_err="";
            isTimeValid(req.body.cook_time_field,"cooking time field");
            cook_time=req.body.cook_time_field;
          }
          catch(err)
          {
            cooking_time_err=err.message;
            is_err=true;
            console.log("err: "+cooking_time_err);
          }

          //validate the total time field
          try{
            total_time_err="";
            isTimeValid(req.body.total_time_field,"total time field");
            total_time=req.body.total_time_field;
          }
          catch(err)
          {
            total_time_err=err.message;
            is_err=true;
            console.log("err: "+total_time_err);
          }

          //validate the equipment fields (user generated fields)
          let MAX_EQUIP_ALLOWED=5;
          let equp_format=".+";
          let equip_err="";
          //let is_there_equip_fields=false;
          let count_equip_field=0;
          let MIN_EQUIPMENT_LENGTH=3;
          let MAX_EQUIPMENT_LENGTH=30;
          for(let [key, value] of Object.entries(req.body)) 
          {
            //find the equip fields
            let id=key.split("equipment");
            //console.log("length of "+id+": "+id.length);
            if(id.length===2)//equip field found(returns [,equip_id_no],now validate its value
            {
              count_equip_field++;
              if(count_equip_field>MAX_EQUIP_ALLOWED)
              {
                equip_err='maximum no of equipment fields have been reached';
              }
              else
              {
                //if(!is_there_equip_fields) is_there_equip_fields=true;
                console.log("id of "+key+": "+id[1]);
                try{
                 validateText("equipment field",value,MIN_EQUIPMENT_LENGTH,MAX_EQUIPMENT_LENGTH,equp_format);
                 equp_arr.push(value.trim());
                }
                catch(err)
                {
                  if(!is_err)
                  {
                    is_err=true;
                    equip_err=err.message;
                  } 
                  else
                  {
                   equip_err="errors in multiple equipment fields";
                  }
                  console.log("equip err: "+err);
                }

              }
              
            } 
          }

          if(req.body.note_field!==undefined)
          {
            try{
              note_err="";
              let MIN_NOTE_LENGTH=0;
              let MAX_NOTE_LENGTH=2000;
              validateText("notes field",req.body.note_field,MIN_NOTE_LENGTH,MAX_NOTE_LENGTH,"",true);
              notes=req.body.note_field.trim();

            }
            catch(err)
            {
              note_err=err.message;
              is_err=true;
              console.log("err: "+note_err);

            }
          }

          //ingredients_list
          ingredients_list=req.body.ingredients_list;
          //recipe steps
          recipe_steps=req.body.recipe_steps;

          if(is_err) res.json({recipe_name_field_error:recipe_name_err,serve_field_error:serving_err,prep_time_field_error:prep_time_err,cook_time_field_error:cooking_time_err,total_time_field_error:total_time_err,equip_field_limit_error:equip_err,note_field_error:note_err});
          else{
            console.log("process err-free form in "+req.params.userid);
            console.log(recipe_name+" "+servings+" "+prep_time+" "+cook_time+" "+total_time);
            console.log(equp_arr);
            console.log(ingredients_list+" "+recipe_steps+" "+notes);
          }

        } 
    
      });
      
      //console.log("reg body:", req.body);
      /*const jsonString = JSON.stringify(req.body);
      console.log("json body: "+jsonString);*/
    })

  ];
/*exports.processNewVoiceRecipe = asyncHandler(async (req, res,next) => {
 
  console.log("process recipe");
  console.log("req file "+req.file);
  const jsonString = JSON.stringify(req.body);
  console.log("json body: "+jsonString);
  //console.log("req body "+req.body);
  res.render("user_views/add_new_voice_recipe", {}); 
});*/

//send ingredients list to client when it sends request to server(GET)
exports.getIngredients=asyncHandler(async (req, res,next) => {
  //console.log("not getting called");
  let ingredients=await getAllIngredients();
  if(ingredients==='database is empty')
  {
    res.json({msg: 'Ingredients database is empty.  Please try again letter'});
  }
  else if(ingredients instanceof Error)
  {
    //test only
    let err_msg=ingredients.message+". Please try again letter";
    //res.json({msg: e.message});
    res.json({msg: err_msg});
  }
  else{
    /*let e=new Error("how");
    let err_msg=e.message+". Please try again letter";*/
    //res.json({msg: 'Ingredients database is empty. please try again letter'});
    res.json(ingredients);
  }
  
});




