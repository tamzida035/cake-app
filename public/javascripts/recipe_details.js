
//***********recipe name code***************
//let recipe_name=document.querySelector('#RecipeDetailsForm input[name="recipe_name_field"]');
let recipe_name_field=document.getElementById("recipe_name_field");
//let recipe_name_err_msg=document.getElementById("recipe_name_field_error_msg");

//to do: on server side validation, remove extra whitespaces from name before saving it
//check if recipe name is valid
//return true if valid else return false
function isRecipeNameValid()
{
  //let condition = /^[a-zA-Z ]{3,25}$/;
  return validateText(recipe_name_field,"Recipe name","recipe_name_field_error_msg");//common_functions.js
}

if(recipe_name_field!==null)
{
  recipe_name_field.addEventListener("input", (event) => {
   isRecipeNameValid();
  });

}

//*************photo uploader code*************
//this file contains fields to validate non-text fields on the client side
//function to calculate uploaded photo file size in kB, mb
function calculateFileSize(number) {
  let ans;
  if (number < 1e3) {
    ans=number+" bytes";
    //return '${number} bytes';
  } else if (number >= 1e3 && number < 1e6) {
    ans=((number / 1e3).toFixed(1))+" KB";
    //return '${(number / 1e3).toFixed(1)} KB';
  }
  else{
    ans=((number / 1e6).toFixed(1))+" MB";
  }
  //return '${(number / 1e6).toFixed(1)} MB';
  return ans;
}

let photo_file_field=document.getElementById("photos");
let photo_status_field=document.getElementById("photos_field_error_msg");;
let MAX_FILE_SIZE=2*1024*1024;//2 MB
let photo_size;

//Note: opacity is used to hide the file input instead of visibility: hidden or display: none, 
//because assistive technology interprets the latter two styles to mean the file input isn't interactive.
//photo_file.style.opacity = 0;(not needed)


//display photo file size or warning if size limit is exceeded
let is_cancel_btn_created=false;

photo_file_field.addEventListener("change",function(){
    
    photo_size=photo_file_field.files[0].size;

    //if a photo has been uploaded, add a 'cancel' button
    if(photo_size>0)
    {
      if(!is_cancel_btn_created){
        is_cancel_btn_created=true;
        let photo_section=document.getElementById("photo_section");

        let cancel_btn=document.createElement('button');
        cancel_btn.type="button";
        cancel_btn.className="btn-close col-md";
        cancel_btn.id="cancel_button";
        
        photo_section.appendChild(cancel_btn);

      }
      
      isPhotoFieldValid();
      //cancel uploaded file if cancel button is pressed
      if(is_cancel_btn_created){
       let cancel_btn=document.getElementById("cancel_button");
       cancel_btn.addEventListener("click",function(){
       photo_file_field.value="";
       is_cancel_btn_created=false;
       //delete the button on deleting the uploaded file
       cancel_btn.remove();
       //clear photo error msg
       photo_status_field.textContent="";
       });
      }

    }

  });

//function to validate photo field
//photo_size: size of photo file
//photo_status_field_name: name of error msg field of photo field element
//return true if photo is valid else return false
const isPhotoFieldValid=function()
{
  let is_valid;
  console.log("photo_size: "+photo_size);
  if(photo_size<=MAX_FILE_SIZE)//no photo errror
  {
    is_valid=true;
    printErrorMsgForPhotoField(calculateFileSize(photo_size),photo_status_field,is_valid);
  } 
  else{//photo error
    is_valid=false;
    printErrorMsgForPhotoField("File size exceeds 2 MB.Please upload another file",photo_status_field,is_valid);
  }
  return is_valid;
}

//************servings code*************
//let recipe_name=document.querySelector('#RecipeDetailsForm input[name="recipe_name_field"]');
let serve_field=document.getElementById("serve_field");
//let serve_err_msg=document.getElementById("serve_field_error_msg");
//to do: on server side validation, throw error if user enters '0';
//check if no of servings is valid
//return true if valid else return false
function isServingValid()
{
  return validateNumber(serve_field,"","serve_field_error_msg");//common_functions.js
}

if(serve_field!==null)
{
  serve_field.addEventListener("input", (event) => {
   isServingValid();
  });

}


//********preparation, cooking and total time code*********


//preparation time variables
let prep_time_field=document.getElementById("prep_time_field");
//let prep_time_err_msg=document.getElementById("prep_time_field_error_msg");

prep_time_field.addEventListener("input", (event) => {
  //isTimeValid(prep_time,prep_time_err_msg);
  isTimeValid(prep_time_field,"prep_time_field_error_msg");//common_functions.js
});

//cooking time variables
let cook_time_field=document.getElementById("cook_time_field");
//let cook_time_err_msg=document.getElementById("cook_time_field_error_msg");

cook_time_field.addEventListener("input", (event) => {
  //isTimeValid(cook_time,cook_time_err_msg);
  isTimeValid(cook_time_field,"cook_time_field_error_msg");//common_functions.js
});

// total time variables
let total_time_field=document.getElementById("total_time_field");
//let total_time_err_msg=document.getElementById("total_time_field_error_msg");

//total time variables
total_time_field.addEventListener("input", (event) => {
  
  //isTimeValid(total_time,total_time_err_msg);
  isTimeValid(total_time_field,"total_time_field_error_msg");//common_functions.js
});

//**********************EQUIPMENT CODE (user added field)**************

//check if an equipment field is valid
//input_field:input field element
//err_msg_field_id: id of error msg field of input_field
//return false if valid else true
function isEquipmentFieldValid(input_field,err_msg_field_id)
{
  return validateText(input_field,"",err_msg_field_id);//common_functions.js
}

// check if all the equipment input fields are valid, before submitting the form
//func validating the user generated fields(equipment1,2,3)
//return true if input in all(if exists) of these fields are valid
function areUserAddedEquipmentFieldsValid()
{
   let inputs = document.querySelectorAll('#RecipeDetailsForm input[id^="equipment"]');
   let count=0;
   inputs.forEach(function(input) {
     let id_no=getNoFromId(input.id);
     let err_msg_field_id="error_equipment"+id_no;
     let err_msg_field=document.getElementById(err_msg_field_id);
     if(isEquipmentFieldValid(input,err_msg_field_id)) count++;
   });
   if(count===inputs.length) return true;
   return false;
}

let MAX_EQUIP_ALLOWED=5;
let total_equp=0;
let add_eqp_btn=document.getElementById("add_equip_field");
let map_equip_no=new Map();// always assign ids with names=prefix+num where num is from 1 to 15. track the nums that are available
let par_eqp=document.getElementById("equip_list");
let limit_err_field=document.getElementById("equip_field_limit_error_msg");
let equp_format;
try{
   equp_format=".+";//works
}
catch(err)
{
    console.log("some browsers give this error: "+err);
}
add_eqp_btn.addEventListener('click', function() {
  //let limit_err_field=document.getElementById("equip_field_limit_error_msg");
  total_equp++;
  if(total_equp<=MAX_EQUIP_ALLOWED)
  {
    let top_level,child_level1,child_level2,child_level3,child_level4,input_field,id_no;

    //generate id number for the subsquent field ids
    if(!map_equip_no.has(total_equp))
    {
      map_equip_no.set(total_equp,1);// this id number does not exist yet, so use it
      id_no=total_equp;
    } 
    else // the id number exists, but may or may not be in use
    {
      let value=map_equip_no.get(total_equp);
      if(value===1)// this id number is already taken, so search for one that is available
      {
        id_no=getIdNumber(MAX_EQUIP_ALLOWED,map_equip_no);
      }
      else if(value===0) id_no=total_equp;//this id number not currently taken, so use it now
      map_equip_no.set(id_no,1);
    }
    console.log("id no assigned: "+id_no);
    
    // parent element to which all other fields will be attached
    let top_level_id="top_level"+id_no;
    top_level=createHtmlElement('div',"row",top_level_id);
    
    //create line break
    let space_id="space_after_equip"+id_no;
    let space=createHtmlElement("div","row mb-3",space_id);
    par_eqp.appendChild(space);

    //add input field to enter equipment
    child_level1=createHtmlElement('div',"col-md-4");// parameterize?
    child_level2=createHtmlElement('div',"contact_1ril");// remove it when closing the modal
    child_level3=createHtmlElement('div',"border_light");
    
    let input_id="equipment"+id_no;
    input_field=createSpecialHtmlElement('input',"form-control border-0",input_id,"","","1 9-inch cake form","30","3",equp_format);
    top_level.appendChild(child_level1).appendChild(child_level2).appendChild(child_level3).appendChild(input_field);
    

    //add button to remove input field
    //let remove_equip_par_id="remove_equp_par"+current_count;
    child_level1=createHtmlElement('div',"col-md-4");// parameterize?
    child_level2=createHtmlElement('h6',"text-center");
    let btn_id="remove_equipment"+id_no;

    let remove_equip_btn=createSpecialHtmlElement("button","button b d-block rounded-0 button_small_size",btn_id,"-");
    top_level.appendChild(child_level1).appendChild(child_level2).appendChild(remove_equip_btn);

    //add error message field
    child_level1=createHtmlElement('div',"col-md-2");// parameterize?-=
    let err_id="error_equipment"+id_no;
    let err_msg_field=createHtmlElement("p","col_red",err_id,"",id_no);
    top_level.appendChild(child_level1).appendChild(err_msg_field);

    //add everything to topmost level
    par_eqp.appendChild(top_level);

    //if remove button is clicked, remove the input field,error field, remove button and added space from the parent node
    remove_equip_btn.addEventListener('click', function() {
      //console.log("parent name: "+top_level_id);
      let parent_level=document.getElementById(top_level_id);
      console.log("name of this field is "+remove_equip_btn.id);
      parent_level.remove();
      // show no msg in equip field limit error field
      limit_err_field.textContent="";
     
      if(total_equp!==0) total_equp--;
      // free up this id no
      map_equip_no.set(id_no,0);
      console.log("Id no "+id_no+" is cleared");
      console.log("after reemoval total fields: "+total_equp);

    });

    //if equipment input field is empty/too long/too short, show error msg
    input_field.addEventListener('input', function() {
      isEquipmentFieldValid(input_field,err_id);
      console.log("INPUT PATT of equip: "+input_field.pattern);

    });
    
  }
  else{
    //display message that Limit has been reached
    limit_err_field.textContent="Maximum "+MAX_EQUIP_ALLOWED+" fields are allowed";
    total_equp=MAX_EQUIP_ALLOWED;
    console.log(" max limit current_count: "+total_equp);
    
  }

});


//check if amounts of ingredients entered are valid
//return true if valid else return false
function areIngredientFieldsValid()
{
  let is_valid=true;
  for (let i in full_recipe)//for each recipe section object
  {
    let element1=full_recipe[i];
    let id=getSectionTitleId(i);
    for (let key in element1)//for each recipe section
    {
      let value = element1[key];
      if(key==='ingredients')
      {
        let j=0;
        for (let key2 in value)
        {
          //console.log("object 1: "+key2);
          if(value.hasOwnProperty(key2))
          {
            j++;
            let ingred = value[key2];
            let ingre_amount_field_id=id+"ingre_amount_input"+j;
            let err_field_id=id+"ingre_field_error_msg"+j;
            let ingre_amount_field=document.getElementById(ingre_amount_field_id);
            let err_field=document.getElementById(err_field_id);

            if(ingre_amount_field!==null){
                   
             if(!validateText(ingre_amount_field,"",err_field_id))//(common_functions.js)
             {
               is_valid=false;

             } 
            }
          }
        }

      }
      
    }
  }
  return is_valid;
}

//*********NOTES FIELD**********************
let notes_field=document.getElementById("note_field");
notes_field.addEventListener("input", (event) => {
  validateText(notes_field,"","note_field_error_msg",true,true);
  //console.log("INPUT PATT of notes: "+notes_field.pattern);
});

//Join ingredient amounts to their names. Store these and the recipe steps in separate variables for sending to server
//return: complete ingredients and recipe steps 
function prepareIngredientsAndRecipeSteps()
{
  let ingre_amount_field_id,ingre_name_field_id,ingre_amount_field,ingre_name_field;
  let complete_ingredients=new Array();
  let complete_recipe_steps=new Array();
  
  for (let i in full_recipe) //each recipe section object
  {
    let element1=full_recipe[i]; 
    let id=getSectionTitleId(i);
    //console.log("i: "+i+" id: "+id);
    let temp_ingredients,temp_recipe_steps;
    //temp_ingredients=[];
    for (let key in element1)//each recipe section
    {
      //console.log("key: "+key);
      let value = element1[key];
      if(key==='section_title')
      {
        //console.log("value: "+value);
        temp_ingredients={
          'section_title': value,
        };
        //temp_ingredients['section_title']=value;
        //console.log("temp sec title in loop: "+temp_ingredients["section_title"]);
        temp_recipe_steps={
          'section_title': value,
        };
        //temp_recipe_steps['section_title']=value;
      }
      else if(key==='steps')
      {
        let temp=new Array();
        for (let key2 in value)
        {
          //console.log("object step: key-value "+key2+" "+JSON.stringify(value[key2]));
          if(value.hasOwnProperty(key2))
          {
            let recipe_step = value[key2];
            temp.push(recipe_step);        
          }
        }
        //console.log("temp step value: "+JSON.stringify(temp));
        temp_recipe_steps["step"]=temp;
        complete_recipe_steps.push(temp_recipe_steps);
        //console.log("temp step in loop: "+JSON.stringify(temp_recipe_steps));

      }
      else if(key==='ingredients'){
        let j=0;
        let temp=new Array();
        for (let key2 in value)
        {
          //console.log("object 2: key-value "+key2+" "+JSON.stringify(value[key2]));
          if(value.hasOwnProperty(key2))
          {
            j++;
            ingre_amount_field_id=id+"ingre_amount_input"+j;
            ingre_name_field_id=id+"ingre_name"+j;
            ingre_amount_field=document.getElementById(ingre_amount_field_id);
            ingre_name_field=document.getElementById(ingre_name_field_id);
            if(ingre_amount_field!==null)
            {
             let ingredient = value[key2];
             temp.push({"name":ingredient.name,"status":ingredient.status,"alternative_ingredients":ingredient.alternative_ingredients,"amount":ingre_amount_field.value});
            }
             
          }
        }
        //console.log("temp value: "+JSON.stringify(temp));
        temp_ingredients["ingredients"]=temp;
        complete_ingredients.push(temp_ingredients);
        //console.log("temp ingred in loop: "+JSON.stringify(temp_ingredients));

      }
      
    }
      
  }
  //console.log("complete Ingred List: "+JSON.stringify(complete_ingredients));
  //console.log("complete RECIPE List: "+JSON.stringify(complete_recipe_steps));
  return [complete_ingredients,complete_recipe_steps];
}
//***************clear form when modal is closed***************
//clears ingredients,equipment and recipe steps (dynamically created input fields) from the form in the modal
function clearRecipeDetailsForm()
{
  //clear ingredients list display
  let par_ingre_list=document.getElementById("ingred_list");
  par_ingre_list.textContent="";
  
  //clear recipe display
  let par_recipe=document.getElementById("complete_recipe");
  par_recipe.textContent="";

  //clear equipment section
  total_equp=0;
  map_equip_no.clear();// always assign ids with names=prefix+num where num is from 1 to 15. track the nums that are available
  let par_eqp=document.getElementById("equip_list");
  par_eqp.textContent="";
  console.log("cleared everything");

}

//case 1: user has clicked the closed button on modal head
let close_recipe_detail_btn=document.getElementById("close_recipe_detail_btn");
close_recipe_detail_btn.addEventListener("click", function () {
  //modal.style.display = "none";
  //clear the dynamic fields created in the recipe_details form
  clearRecipeDetailsForm();
});

//case 2: user has clicked the cancel button on modal footer
let cancel_recipe_detail_btn=document.getElementById("cancel_recipe_btn");
let finish_recipe_modal=document.getElementById("finish_modal");
cancel_recipe_detail_btn.addEventListener("click", function () {
  //Call the modal hide method directly without checking form validity
  //const modal = bootstrap.Modal.getInstance(finish_recipe_modal);
  //if(modal!==null) modal.hide();
  //modal.style.display = "none";
  //clear the dynamic fields created in the recipe_details form
  clearRecipeDetailsForm();
});

let save_recipe_detail_btn=document.getElementById("save_recipe_btn");

//do not submit form if the following condition occurs
//return true if all fields in recipe form is valid else return false
function isRecipeFormValid(){
    //console.log("inside isRecipeFormValid");
    //let valid_name_field=isRecipeNameValid();//original
    let valid_name_field=true;
    //let valid_serve_field=isServingValid();//original
    let valid_serve_field=true;
    //let valid_photo_field=(photo_size!==undefined && photo_size>MAX_FILE_SIZE);
    //let valid_prep_field=isTimeValid(prep_time_field,"prep_time_field_error_msg");//original
    let valid_prep_field=true;
    //let valid_cook_field=isTimeValid(cook_time_field,"cook_time_field_error_msg");//original
    let valid_cook_field=true;
    //let valid_total_field=isTimeValid(total_time_field,"total_time_field_error_msg");//original
    let valid_total_field=true;
    //let valid_equip_fields=areUserAddedEquipmentFieldsValid();//original
    let valid_equip_fields=true;
    let valid_ingred_amount_fields=areIngredientFieldsValid();//original
    //let valid_ingred_amount_fields=true;
    console.log("valid_name_field: "+valid_name_field+" valid_serve_field: "+valid_serve_field+" valid_prep_field: "+valid_prep_field);
    console.log("valid_cook_field: "+valid_cook_field+" valid_total_field: "+valid_total_field+" valid_equip_fields: "+valid_equip_fields);
    console.log("valid_ingred_amount_fields: "+valid_ingred_amount_fields);
    if(valid_name_field && valid_serve_field && valid_prep_field && valid_cook_field && valid_total_field && valid_equip_fields && valid_ingred_amount_fields) return true;
    return false;
}

//removes ingredient amount input field from the form
//fd; the form from which the fields should be removed
//return:modified form
function removeIngredientFieldsFromForm(fd)
{
  for (let i in full_recipe)//for each recipe section object
  {
    let element1=full_recipe[i];
    let id=getSectionTitleId(i);
    for (let key in element1)//for each recipe section
    {
      let value = element1[key];
      if(key==='ingredients')
      {
        let j=0;
        for (let key2 in value)
        {
          //console.log("object 1: "+key2);
          if(value.hasOwnProperty(key2))
          {
            j++;
            let ingre_amount_field_name=id+"ingre_amount_input"+j;
            let ingre_amount_field=document.getElementById(ingre_amount_field_name);

            if(ingre_amount_field!==null)
            {
              if(fd.has(ingre_amount_field_name)) fd.delete(ingre_amount_field_name);
            }
               
          }
        }

      }
      
    }
  }
  return fd;

}


const form_client = document.getElementById('RecipeDetailsForm');// works with client side validation only
const form_server = document.querySelector("#RecipeDetailsForm");//  works with server side validation only
//submit form to server
async function sendData() {
  //add the ingred amounts to respective ingredients in full_recipe
  let [complete_ingredients,complete_recipe_steps]=prepareIngredientsAndRecipeSteps();
  //construct a formdata object for the form
  let fd = new FormData(form_server);
  fd.append("ingredients_list",complete_ingredients);
  fd.append("recipe_steps",complete_recipe_steps);

  //remove the ingredient fields from the form
  fd=removeIngredientFieldsFromForm(fd);

  /*console.log("sending following data to server");
  for (let [key, value] of fd.entries()) {
      console.log(`${key}:`, value);
  }*/
  //send data to server
  try{
    let url=form_server.action;
    let response=await fetch(url, {
      method: "POST",
      body: fd,
    });
    const form_field_errs = await response.json();
    /*console.log("Received data from server: "+form_field_errs);
    const jsonString = JSON.stringify(form_field_errs);
    console.log("json body: "+jsonString);*/
    // display errors recived from server
    printErrorMsg2(form_field_errs.recipe_name_field_error,recipe_name_field,"recipe_name_field_error_msg");
    printErrorMsgForPhotoField(form_field_errs.photos_field_error,photo_status_field,false);
    printErrorMsg2(form_field_errs.serve_field_error,serve_field,"serve_field_error_msg");
    printErrorMsg2(form_field_errs.prep_time_field_error,prep_time_field,"prep_time_field_error_msg");
    printErrorMsg2(form_field_errs.cook_time_field_error,cook_time_field,"cook_time_field_error_msg");
    printErrorMsg2(form_field_errs.total_time_field_error,total_time_field,"total_time_field_error_msg");
    limit_err_field.textContent=form_field_errs.equip_field_limit_error;
    printErrorMsg2(form_field_errs.note_field_error,note_field,"note_field_error_msg");
  }
  catch(err){
    console.log("response returned on client side");
    final_error_field.textContent=err.message;
  }
}
//form submission on clicking submit button 'save'
let final_error_field=document.getElementById("final_error_msg");
document.addEventListener('DOMContentLoaded', function() {
  //works (server side?)
  form_server.addEventListener('submit', function(event) {
    event.preventDefault();
    console.log("submit button clicked");
    //if any of the inputs are invalid, do not submit the form
    if(isRecipeFormValid())
    {
      sendData();
      //event.preventDefault();
    } 
    else
    {
      //event.preventDefault();
      final_error_field.textContent="Please fill-in the required fields in the correct formats";
      return;
    } 
    
  });
  //trial (works only for client side)
  /*form_client.addEventListener('submit', function(event) {
    
    //console.log("trying to submit form");
    sendData();
    event.preventDefault();
  });*/
});
