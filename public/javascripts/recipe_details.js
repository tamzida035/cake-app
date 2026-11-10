
//***********recipe name code***************
//let recipe_name=document.querySelector('#RecipeDetailsForm input[name="recipe_name_field"]');
let recipe_name=document.getElementById("recipe_name_field");
//let recipe_name_err_msg=document.getElementById("recipe_name_field_error_msg");

//to do: on server side validation, remove extra whitespaces from name before saving it
//check if recipe name is valid
//return true if valid else return false
function isRecipeNameValid()
{
  let condition = /^[a-zA-Z ]{3,25}$/;
  return validateText(recipe_name,"Recipe name","recipe_name_field_error_msg",condition);//common_functions.js
}

if(recipe_name!==null)
{
  recipe_name.addEventListener("input", (event) => {
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

let photo_file=document.getElementById("photos");
let photo_status=document.getElementById("photos_field_error_msg");;
let MAX_FILE_SIZE=2*1024*1024;//2 MB
let photo_size;

//Note: opacity is used to hide the file input instead of visibility: hidden or display: none, 
//because assistive technology interprets the latter two styles to mean the file input isn't interactive.
//photo_file.style.opacity = 0;(not needed)

//display photo file size or warning if size limit is exceeded
let is_cancel_btn_created=false;

photo_file.addEventListener("change",function(){
    
    photo_size=photo_file.files[0].size;

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
      
      if(photo_size<=MAX_FILE_SIZE)
      {
        photo_status.innerHTML=calculateFileSize(photo_size);
      } 
      else{
       photo_status.innerHTML="File size exceeds 2 MB.Please upload another file";
      }
      //cancel uploaded file if cancel button is pressed
      if(is_cancel_btn_created){
       let cancel_btn=document.getElementById("cancel_button");
       cancel_btn.addEventListener("click",function(){
       photo_file.value="";
       is_cancel_btn_created=false;
       //delete the button on deleting the uploaded file
       cancel_btn.remove();
       //clear photo error msg
      photo_status.innerHTML="";
       });
      }

    }

  });

//************servings code*************
//let recipe_name=document.querySelector('#RecipeDetailsForm input[name="recipe_name_field"]');
let serve=document.getElementById("serve_field");
//let serve_err_msg=document.getElementById("serve_field_error_msg");
//to do: on server side validation, throw error if user enters '0';
//check if no of servings is valid
//return true if valid else return false
function isServingValid()
{
  return validateNumber(serve,"","serve_field_error_msg");//common_functions.js
}

if(serve!==null)
{
  serve.addEventListener("input", (event) => {
   isServingValid();
  });

}


//********preparation, cooking and total time code*********


//preparation time variables
let prep_time=document.getElementById("prep_time_field");
//let prep_time_err_msg=document.getElementById("prep_time_field_error_msg");

prep_time.addEventListener("input", (event) => {
  //isTimeValid(prep_time,prep_time_err_msg);
  isTimeValid(prep_time,"prep_time_field_error_msg");//common_functions.js
});

//cooking time variables
let cook_time=document.getElementById("cook_time_field");
//let cook_time_err_msg=document.getElementById("cook_time_field_error_msg");

cook_time.addEventListener("input", (event) => {
  //isTimeValid(cook_time,cook_time_err_msg);
  isTimeValid(cook_time,"cook_time_field_error_msg");//common_functions.js
});

// total time variables
let total_time=document.getElementById("total_time_field");
//let total_time_err_msg=document.getElementById("total_time_field_error_msg");

//total time variables
total_time.addEventListener("input", (event) => {
  
  //isTimeValid(total_time,total_time_err_msg);
  isTimeValid(total_time,"total_time_field_error_msg");//common_functions.js
});

//**********************EQUIPMENT CODE (user added field)**************

//check if an equipment field is valid
//input_field:input field element
//input_field_name: name of the input field
//err_msg_field: id of error msg field of input_field
//return false if valid else true
function isEquipmentFieldValid(input_field,input_field_name)
{
  return validateText(input_field,"",input_field_name);//common_functions.js
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
add_eqp_btn.addEventListener('click', function() {
  let limit_err_field=document.getElementById("equip_field_limit_error_msg");
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
    input_field=createSpecialHtmlElement('input',"form-control border-0",input_id,"","","1 9-inch cake form","30","3");
    top_level.appendChild(child_level1).appendChild(child_level2).appendChild(child_level3).appendChild(input_field);
    //par.appendChild(top_level);

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
    let err_msg_field=createHtmlElement("p","col_green",err_id,"",id_no);
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
      //if(current_count===6) current_count=5;
      if(total_equp!==0) total_equp--;
      // free up this id no
      map_equip_no.set(id_no,0);
      console.log("Id no "+id_no+" is cleared");
      console.log("after reemoval total fields: "+total_equp);

    });

    //if equipment input field is empty/too long/too short, show error msg
    input_field.addEventListener('input', function() {
      isEquipmentFieldValid(input_field,err_id);

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
  for (let i in full_recipe)
  {
    let element1=full_recipe[i];
    let id=getSectionTitleId(i+1);
    let j=0;
    //console.log("object 1 inside recipe_detail: "+full_recipe[i]);
    for (let key in element1)//for each recipe section
    {
      j++;
      let value = element1[key];
      //if(Array.isArray(value)) continue;
      let ingre_amount_field_id=id+"ingre_amount_input"+j;
      let err_field_id=id+"ingre_field_error_msg"+j;
      let ingre_name_field_id=id+"ingre_name"+j;
      let ingre_amount_field=document.getElementById(ingre_amount_field_id);
      let err_field=document.getElementById(err_field_id);
      let ingre_name_field=document.getElementById(ingre_name_field_id);

      if(ingre_amount_field!==null){
        if(isIngredientAmountValid(ingre_amount_field,err_field,ingre_name_field.textContent))//returns true if invalid(common_functions.js)
        {
          if(is_valid) is_valid=false;

        } 
         
      }
    
    }
  }
  return is_valid;
}

//add ingredient name with corresponding amount in input field 
function addIngredientNameAndAmount()
{
  for (let i in full_recipe)//for each section_titlee
  {
    let element1=full_recipe[i];
    let id=getSectionTitleId(i+1);
    let j=0;
    for (let key in element1)//for each section of recipe
    {
      //let j=0;
      j++;
      let value = element1[key];
      //if(Array.isArray(value)) continue;
      console.log("recipe section "+element1[key]);
      const jsonString = JSON.stringify(value);
      console.log("json body: "+jsonString);
      let ingre_amount_field_id=id+"ingre_amount_input"+j;
      let ingre_name_field_id=id+"ingre_name"+j;
      let ingre_amount_field=document.getElementById(ingre_amount_field_id);
      let ingre_name_field=document.getElementById(ingre_name_field_id);
      if(ingre_amount_field!==null)
      {
        let temp=ingre_amount_field.value;
        ingre_amount_field.value=ingre_name_field.textContent+", "+temp;
        console.log("final value: "+ingre_amount_field.value);
      }
      /*for (let key2 in value)//for each ingredient
      {
        
        let value2 = value[key2];
        console.log("secret "+value2);

      }*/

    }
  }
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
  modal.style.display = "none";
  //clear the dynamic fields created in the recipe_details form
  clearRecipeDetailsForm();
});

//case 2: user has clicked the cancel button on modal footer
let cancel_recipe_detail_btn=document.getElementById("cancel_recipe_btn");
cancel_recipe_detail_btn.addEventListener("click", function () {
  //Call the modal hide method directly without checking form validity
  const modal = bootstrap.Modal.getInstance(cancel_recipe_detail_btn);
  if(modal!==null) modal.hide();
  //modal.style.display = "none";
  //clear the dynamic fields created in the recipe_details form
  console.log("what went wrong here");
  clearRecipeDetailsForm();
});



//do not submit form if the following condition occurs
//return true if all fields in recipe form is valid else return false
function isRecipeFormValid(){
    console.log("inside isRecipeFormValid");
    let valid_name_field=isRecipeNameValid();
    let valid_serve_field=isServingValid();
    //let valid_photo_field=(photo_size!==undefined && photo_size>MAX_FILE_SIZE);
    let valid_prep_field=isTimeValid(prep_time,"prep_time_field_error_msg");
    let valid_cook_field=isTimeValid(cook_time,"cook_time_field_error_msg");
    let valid_total_field=isTimeValid(total_time,"total_time_field_error_msg");
    let valid_equip_fields=areUserAddedEquipmentFieldsValid();
    let valid_ingred_amount_fields=areIngredientFieldsValid();
    console.log("valid_name_field: "+valid_name_field+" valid_serve_field: "+valid_serve_field+" valid_prep_field: "+valid_prep_field);
    console.log("valid_cook_field: "+valid_cook_field+" valid_total_field: "+valid_total_field+" valid_equip_fields: "+valid_equip_fields);
    console.log("valid_ingred_amount_fields: "+valid_ingred_amount_fields);
    if(valid_name_field && valid_serve_field && valid_prep_field && valid_cook_field && valid_total_field && valid_equip_fields && valid_ingred_amount_fields) return true;
    return false;
    /*let a=!isRecipeNameValid()||!isServingsValid()|| !isTimeValid(prep_time,prep_time_err_msg)|| !isTimeValid(cook_time,cook_time_err_msg)|| !isTimeValid(total_time,total_time_err_msg)|| !areUserAddedEquipmentFieldsValid()||areIngredientFieldsValid();
    return a;*/
    /*if(!isRecipeNameValid()) return false;
    //these fields return false if valid and vice versa
    if(isServingsValid()|| isTimeValid(prep_time,prep_time_err_msg)|| isTimeValid(cook_time,cook_time_err_msg)|| isTimeValid(total_time,total_time_err_msg)|| !areUserAddedEquipmentFieldsValid()) return false;
    return areIngredientFieldsValid();*/
}

//isRecipeFormValid();

const form_client = document.getElementById('RecipeDetailsForm');// works with client side validation only
const form_server = document.querySelector("#RecipeDetailsForm");//  works with server side validation only
//submit form to server
async function sendData() {
  //construct a formdata object for the form
  //add ingredient name with corresponding amount in input field 
  addIngredientNameAndAmount();
  const fd = new FormData(form_server);
  fd.append("full_recipe",full_recipe);
  for (let [key, value] of fd.entries()) {
      console.log(`${key}:`, value);
  }
  fetch('https://localhost/users/add_new_recipe_by_voice', {
      method: "POST",
      body: fd,
  }).then(response => console.log(response))
  .catch(error => console.error('Error:', error));
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
      final_error_field.textContent="Please fill-in the required fields(*) in the correct formats";
      //console.log("prevented submit form");
      return;
    } 
    //event.preventDefault();
    
  });
  //trial (works only for client side)
  /*form_client.addEventListener('submit', function(event) {
    
    //console.log("trying to submit form");
    sendData();
    event.preventDefault();
  });*/
});
