
//***********recipe name code***************
//let recipe_name=document.querySelector('#RecipeDetailsForm input[name="recipe_name_field"]');
let recipe_name=document.getElementById("recipe_name_field");
let recipe_name_err_msg=document.getElementById("recipe_name_field_error_msg");

//to do: on server side validation, remove extra whitespaces from name before saving it
//check if recipe name is valid
//return true if valid else false
function isRecipeNameValid()
{
  let is_err=false;

   if (recipe_name.validity.valid) 
   {
    //valid recipe name
    recipe_name_err_msg.textContent = ""; // Remove the message content
  
  }
  else if (recipe_name.validity.valueMissing) {
    // If empty
    is_err=true;
    recipe_name_err_msg.textContent = "name cannot be empty";
  } 
  else if (recipe_name.validity.patternMismatch) {
    // If format is invalid
    is_err=true;
    recipe_name_err_msg.textContent = "incorrect format";
  }
  else if (recipe_name.validity.tooShort) {
    // If the value is too short,
    is_err=true;
    recipe_name_err_msg.textContent = "name too short";
  }
  else if (recipe_name.validity.tooLong) {
    // If the value is too long,
    is_err=true;
    recipe_name_err_msg.textContent = "name too long";
  }
  highlightErrField(is_err,recipe_name);
  return is_err;
}

if(recipe_name!==null)
{
  recipe_name.addEventListener("input", (event) => {
   isRecipeNameValid();
  });

}



//*************photo uploader code*************
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
      
      if(photo_size<MAX_FILE_SIZE)
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
let serve_err_msg=document.getElementById("serve_field_error_msg");

//to do: on server side validation, throw error if user enters '0';
//check if no of servings is valid
//return true if valid else false
function isServingsValid()
{
  let is_err=false;

   if (serve.validity.valid) 
   {
    //valid value
    serve_err_msg.textContent = ""; // Remove the message content
  }
  else if (serve.validity.valueMissing) {
    // If empty
    is_err=true;
    serve_err_msg.textContent = "must enter a number";
  } 
  else if (serve.validity.rangeUnderflow) {
    // If format is invalid
    is_err=true;
    serve_err_msg.textContent ="invalid number";
  }
  highlightErrField(is_err,serve);
  return is_err;
}

serve.addEventListener("input", (event) => {
  isServingsValid();
});


//********preparation, cooking and total time code*********

//check whether a string contains 'min'
//str: tokenized string
//return true if valid else false
function isStringMin(str)
{
  return (str==="min");
}

//check whether a string contains 'min'
//str: tokenized string
//return true if valid else false
function isStringHr(str)
{
  return (str==="hr");
}

//check whether number beside 'hr' or 'min' is withing valid range
//str: tokenized string
//no:the integer to compare
//return true if valid else false
function isRangeValid(str,no)
{
  if(str==="hr")
  {
    //valid hr: 0-99
    if(no>=0 && no<=99) return true;
    return false;
  }
  else if(str==="min")
  {
    //valid min: 0-59
    if(no>=0 && no<=59) return true;
    return false;

  }
  return false;

}


//check if time duration entered by user in prep/cooking time is valid
//input:input field
//return true if valid else false
function isDurationFormatValid(input)// 0 min/hr, 0 hr 0 min should not be allowed
{
  //discard any non-alphanumeric characters
  let RegEx = /^[a-z0-9 ]+$/i;
  let val = input.trim(); 
  //console.log("trimmed value: "+val);
  let is_input_alphanumeric = RegEx.test(val);
  //console.log("value of reg test: "+is_input_alphanumeric);
  if(!is_input_alphanumeric) return false;
  else{
    //tokenize input
    let token_array=input.split(" ");
    //console.log("token length: "+token_array.length);
    //valid no of tokens should be 2 or 4
    if(token_array.length===2)
    {
      //valid input format: a number followed by either of hr/min but not both eg 1 min or 1 hr
      //check for no
      let no=parseInt(token_array[0]);
      //no is not a number->"invalid format"
      if(no===NaN) return false;

      // check for min/hr
      let find_min=isStringMin(token_array[1]);
      let find_hr=isStringHr(token_array[1]);
      //0 min and 0 hr are not allowed
      if(no===0 && (find_min||find_hr)) return false;

      //if last token is "min", determine if no belongs to its range
      if(find_min) return isRangeValid("min",no);
      else{
         //if last token is "hr", determine if no belongs to its range
        if(find_hr) return isRangeValid("hr",no);
        return false; // since no is neither followed by 'min' nor by 'hr'->"invalid format"
      }

    }
    else if(token_array.length==4)
    {
      //valid input format: [0-99] hr [0-59] min

      //check for first no
      let no1=parseInt(token_array[0]);
      //no1 is not a number->"invalid format"
      if(no1===NaN) return false;

      //check for hr 
      let find_hr=isStringHr(token_array[1]);
      if(find_hr)
      {
        //determine if no1 belongs to valid range of hr
        if(!isRangeValid("hr",no1)) return false;
        else{// no1 belongs to valid  range of hr
          //check for second no
          let no2=parseInt(token_array[2]);
          //no2 is not a number->"invalid format"
          if(no2===NaN) return false;

          //check for min
          let find_min=isStringMin(token_array[3]);
          if(find_min)
          {
            //determine if no2 belongs to valid range of min
            if(!isRangeValid("min",no2)) return false;
            else{
              //0 hr 0 min is not allowed
              if(no1===0 && no2===0) return false;
              return true;
            }
          }
          return false;//could not find min 
        }

      }
      return false;//could not find hr 
      
    }
    else return false;//no of tokens is neither 2 nor 4
  }
}
//let recipe_name=document.querySelector('#RecipeDetailsForm input[name="recipe_name_field"]');

//check if prep time/cooking time is valid
//return true if valid else false
//my_time:input id
//my_time_err_msg: id of error field of my_time
function isTimeValid(my_time,my_time_err_msg)
{
  let is_err=false;
  if (my_time.validity.valueMissing) {
    // If empty
    is_err=true;
    my_time_err_msg.textContent = "must enter time duration";
  }
  else{
    //let exp="((\d+(\.\d+)?)\s*(h|hr|hrs|hours))?(\s*(\d+)\s*(m|min|mins|minutes))?";
    console.log("orig value: "+my_time.value);
    //console.log("typeof: "+typeof(my_time.value));
    if(!isDurationFormatValid(my_time.value)){
      is_err=true;
      my_time_err_msg.textContent ="invalid format";
    }
    else{
      //console.log("enter here 1");
      my_time_err_msg.textContent = ""; 
    }

  }
  highlightErrField(is_err,my_time);
  return is_err;
}
//preparation time variables
let prep_time=document.getElementById("prep_time_field");
let prep_time_err_msg=document.getElementById("prep_time_field_error_msg");

prep_time.addEventListener("input", (event) => {
  console.log("listener called");
  //let input=prep_time.textContent;
  isTimeValid(prep_time,prep_time_err_msg);
});

//cooking time variables
let cook_time=document.getElementById("cook_time_field");
let cook_time_err_msg=document.getElementById("cook_time_field_error_msg");

cook_time.addEventListener("input", (event) => {
  console.log("listener called");
  //let input=prep_time.textContent;
  isTimeValid(cook_time,cook_time_err_msg);
});

// total time variables
let total_time=document.getElementById("total_time_field");
let total_time_err_msg=document.getElementById("total_time_field_error_msg");

//total time variables
total_time.addEventListener("input", (event) => {
  console.log("listener called");
  //let input=prep_time.textContent;
  isTimeValid(total_time,total_time_err_msg);
});

//**********************EQUIPMENT CODE (user added field)**************

//check if an equipment field is valid
//input_field:input field id
//err_msg_field: id of error msg field of input_field
//return true if valid else false
function isEquipmentFieldValid(input_field,err_msg_field)
{
  let is_err=false;
  if(input_field.validity.valid) 
  {
    //valid value
    err_msg_field.textContent = ""; // Remove the message content
  }
  else if (input_field.validity.valueMissing) 
  {
    //If empty
    is_err=true;
    err_msg_field.textContent = "field cannot be empty";
  } 
  else if(input_field.validity.tooShort)
  {
    //input length too short
    is_err=true;
    err_msg_field.textContent = "not enough characters entered";
  }
  else if(input_field.validity.tooLong)
  {
    //input length too long
    is_err=true;
    err_msg_field.textContent = "character limit exceeded";
  }
  
  console.log("highlight isEquipmentFieldValid ");
  highlightErrField(is_err,input_field);

  return is_err;

}

// check if all the equipment input fields are valid, before submitting the form
//func validating the user generated fields(equipment1,2,3)
//return true if input in all(if exists) of these fields are valid
function areUserAddedEquipmentFieldsValid()
{
   let inputs = document.querySelectorAll('#RecipeDetailsForm input[id^="equipment"]');
   inputs.forEach(function(input) {
     let id_no=getNoFromId(input.id);
     //console.log("id_no of err field"+id_no);
     let err_msg_field_id="error_equipment"+id_no;
     let err_msg_field=document.getElementById(err_msg_field_id);
     console.log("call isEquipmentFieldValid ");
     let isValid=isEquipmentFieldValid(input,err_msg_field);
     if(!isValid) return false;

   });
   return true;

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
    let err_msg_field=createHtmlElement("p","col_green",err_id,"font-size: x-small;",id_no);
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
      isEquipmentFieldValid(input_field,err_msg_field);
     /*let is_err=false;
     if(input_field.validity.valid) 
     {
       //valid value
       err_msg_field.textContent = ""; // Remove the message content
     }
     else if (input_field.validity.valueMissing) {
      // If empty
      is_err=true;
      err_msg_field.textContent = "field cannot be empty";
     } 
     else if(input_field.validity.tooShort)
     {
      //input length too short
      is_err=true;
      err_msg_field.textContent = "not enough characters entered";
     }
     else if(input_field.validity.tooLong)
     {
      //input length too short
      is_err=true;
      err_msg_field.textContent = "character limit exceeded";
     }
     highlightErrField(is_err,input_field);*/

    });
    
  }
  else{
    //display message that Limit has been reached
    limit_err_field.textContent="Maximum "+MAX_EQUIP_ALLOWED+" fields are allowed";
    total_equp=MAX_EQUIP_ALLOWED;
    console.log(" max limit current_count: "+total_equp);
    
  }

});



//**********************CODE TO DISPLAY RECIPE STEP AND INGREDIENTS**************
//get section title with no
//n: the nth section title
//return: a id generated for the nth section title
function getSectionTitleId(n)
{
   let name="sec_title"+n;
   return name;
}

//function to add extra features to dynamically added fields in recipe details form(move to common__functions.js?)
//e_name: name of element to be created ('e.g. div','input','p','span','h1')
//e_class_name: name of class of e_name; 
//id:id of the section title
//type_of_node: name of element to be created ('e.g. div','input','p','span','h1')
//j: the jth ingre of a section title
//text:textcontent to write in e
//is_err: true if there is error in ingredient field amount else false
//pla_hold: place holder of element created
//sty: style of element
//maxlen: maximum length of value in created input field
//minlen: minimum length of value in created input field
//return: modified element e
/*function createSpecialHtmlElement(e_name,e_class_name,id="",text="",sty="",pla_hold="",maxlen=" ",minlen="")
{ 
  let e=createHtmlElement(e_name,e_class_name,id,sty,text);
  if(e_name==='i')
  {
      e.title="Alternative ingredient to "+text;
  }
  else if(e_name==='input')//write amount of ingredient
  {
      //e=createHtmlElement(e_name,e_class_name,id,sty);
      //console.log("equip field inside specialElem: "+e);
      e.setAttribute("type","text");
      //e.placeholder="1 tsp(melted)";
      e.placeholder=pla_hold;
      e.required=true;
      e.name=id;
      //e.maxLength="20";
      e.maxLength=maxlen;
      e.minLength=minlen;
  }
  else if(e_name==="button")
  {
    e.setAttribute("type","button");
    e.required=true;
    e.name=id;
  }
  //else e=createHtmlElement(e_name,e_class_name,id,sty,text);
  return e;
}*/


//check that no of ingredient specified is in correct format
//err_msg: id of the paragraph field that display error message
//str: string containing the number (whole or fractional)
//return true if valid else reeturn false
function isNumberOfIngredientValid(str,err_msg)
{
  let no_err=true;
  //check that the first token is a str in number format: contains only numbers and '/'
  let is_valid_string =areCharactersValid(str,false,true,['/']);// common_functions.js
  if(is_valid_string===false)
  {
    //err_msg.textContent = "[a-zA-Z0-9],whitespaces,/,comma and +";
    err_msg.textContent="write whole or fractional number";
    no_err=false;
  }
  else{//0/2
    let fractional_no=str.split("/");
    //console.log("fractional array length: "+fractional_no.length);
    if(fractional_no.length===2)// fraction have  a numerator and  a denominators
    {
          let parsed_numerator=Number.parseInt(fractional_no[0]);
          let parsed_denominator=Number.parseInt(fractional_no[1]);
          //console.log("numer: "+fractional_no[0]);
          //console.log("fractional numera a number? : "+Number.isInteger(fractional_no[0]));
          //console.log("deno: "+fractional_no[1]);
          //console.log("fractional deno a number? : "+Number.isInteger(fractional_no[1]));
          if(parsed_numerator===NaN || parsed_denominator===NaN)
          {
            err_msg.textContent="invalid number format";
            no_err=false;

          }
          else if(parsed_numerator===0 || parsed_denominator===0)
          {
            err_msg.textContent="please enter non-zero value";
            no_err=false;

          }
     }
    else{
      //console.log("str length: "+str.length);
      if(fractional_no[0]===str)// whole number
      {
        let no=Number.parseInt(str);
        if(no===0)// 0 is invalid amount to enter
        {
          err_msg.textContent="please enter non-zero value";
          no_err=false;
        }
        else console.log("should return true");
      }
      else{
        err_msg.textContent="invalid number format";
        no_err=false;
      }
    }
        
  }
  //console.log(" return no+err: "+no_err);
  return no_err;

}

//check that unit of ingredient specified is in correct format
//err_msg: id of the paragraph field that display error message
//str: string containing the measuring unit
//ingred: json obbject containing {ingred_name,status, alternative ingred list}
//return true if valid else return false
function isUnitOfIngredientValid(str, err_msg,ingred)
{
  //let found=false;
  //special case: for eggs/eeggs: unit is L/M/S
  if(ingred.name=="egg" || ingred.name==="eggs")
  {
    let valid_units=['S','s','M','m','L','l'];
    for(let i=0;i<valid_units.length;i++)
    {
      if(str===valid_units[i]) return true;
    
    }
  }
  else{
   let valid_units=['oz','cup','cups','tsp','tbsp','ml','pt','gal','lb','pound'];
   for(let i=0;i<valid_units.length;i++)
   {
     if(str===valid_units[i]) return true;
   }
  }
  err_msg.textContent = "must enter an allowed measuring unit";
  return false;
}


//check that additional info about ingredient specified is in correct format
//err_msg: id of the paragraph field that display error message
//str: string containing the additional info
//return true if valid else return false
function isOptionalInfoValid(str, err_msg)
{
  let len=str.length;
  // valid format: (....) or ""
  if(str.trim()==="") return true;

  if(str==="()")
  {
    err_msg.textContent = "additional info: empty bracket";
    return false;
  }
  if(str[0]!=='(' || str[len-1]!==')')
  {
    err_msg.textContent = "additional info: missing bracket";
    return false;
  }
  return true;

}

//check if ingredient amount mentioned is valid
//err_msg: id of the paragraph field that display error message
//element_id; id of the input field that takes ingredient amount as input
//ingred: json obbject containing {ingred_name,status, alternative ingred list}
function isIngredientAmountValid(element_id,err_msg,ingred){
  let is_err=false;
  let input=element_id.value;
  if(input.trim()==="")
  {
    err_msg.textContent = "must enter an amount";
    is_err=true;
  }
  else{
    //format: 1 tsp (melted, at room temperature)
    //format: 1/3 cup
    //format: 1 M/L/S (only for eggs)
    //amount field format: can contain alphabets,numbers, whitespaces,'/','+' and ','
    //discard if input contains invalid characters
    //if input contains any invalid characters, reject it
 
    //let is_valid_string =validateRegExp(val,RegEx);
    let valid_char_set=['/',',','(',')'];
    let is_valid_string =areCharactersValid(input,true,true,valid_char_set);// function given in common_functions.js module
    //console.log("is str valid: "+is_valid_string);
    if(is_valid_string===false)
    {
      //err_msg.textContent = "[a-zA-Z0-9],whitespaces,/,comma and +";
      err_msg.textContent="invalid character(s)";
      is_err=true;
    }
    else{
     //tokenize input
     let token_array=input.split(" ");
     /*console.log("token length: "+token_array.length);

     for(let i=0;i<token_array.length;i++)
     {
       console.log("token: "+token_array[i]);
     }*/
     //check if amount entered is valid number
     is_err=!isNumberOfIngredientValid(token_array[0],err_msg);
     if(!is_err)// number of ingred is valid
     {
       if(token_array.length>1)//check unit of ingredient
       {
        is_err=!isUnitOfIngredientValid(token_array[1],err_msg,ingred);

       }
       else// unit is missing
       {
        err_msg.textContent="specify measuring unit";
        is_err=true;

       }
     }

    if(!is_err)// unit specified by user is valid
    {
      //console.log("token array: "+token_array);
      if(token_array.length>2)// check if optional info is added by user
      {
        is_err=!isOptionalInfoValid(token_array[2],err_msg);

      }
    }
    //no error found
    if(!is_err) err_msg.textContent="";
      
   }

  }
  //console.log("before highlighting is_err: "+is_err);
  highlightErrField(is_err,element_id);
  return is_err;

}

//add eventListener to all input fields of ingredient amounts
//error field id format: sec_title01ingre_field_error_msg1
//input field id format: id+"ingre"+j
function checkIngredientAmounts()
{
  for (let i in full_recipe) 
  {
    let element1=full_recipe[i];
    let id=getSectionTitleId(i+1);
    //console.log("object 1 inside recipe_detail: "+full_recipe[i]);
    for (let key in element1)//for each section_titlee
    {
      let j=0;
      let value = element1[key];
      for (let key2 in value)//for each ingredient
      {
        j++;
        let name_field=id+"ingre_amount_input"+j;
        let err_field_name=id+"ingre_field_error_msg"+j;
        let element_id=document.getElementById(name_field);
        let err_id=document.getElementById(err_field_name);

        let ingred = value[key2];// collect the ingred name also because for eggs,conventional specified units cannot be used
        //console.log("object 3: "+value2.name+" "+value2.status);
        if(element_id!==null){
          element_id.addEventListener("change",(event) => {
            isIngredientAmountValid(element_id,err_id,ingred);
          });
          //isIngredientAmountValid(element_id,err_id);

        }

      }

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



//do not submit form if the following condition occurs (might not be needed)
/*function isRecipeFormValid(){
    if(photo_status!==undefined)
    {
      if(photo_status.textContent==="File size exceeds 2 MB.Please upload another file") return false;
    }
    console.log("inside isRecipeFormValid");
    //if(!isRecipeNameValid()|| !isServingsValid()|| !isTimeValid(prep_time,prep_time_err_msg)|| !isTimeValid(cook_time,cook_time_err_msg)|| !isTimeValid(total_time,total_time_err_msg)) return false;
    if(!areUserAddedEquipmentFieldsValid()) return false;
    return true;
}*/

//isRecipeFormValid();

/*const form_client = document.getElementById('RecipeDetailsForm');// works with client side validation only
const form_server = document.querySelector("#RecipeDetailsForm");//  works with server side validation only
//submit form to server
async function sendData() {
  //construct a formdata object for the form
    const fd = new FormData(form_server);
    try {
    const response = await fetch('https://localhost/users/add_new_recipe_by_voice', {
      method: "POST",
      headers: {
            'Content-Type': 'application/json'
          },
      // Set the FormData instance as the request body
      body: fd,
    });
    console.log(await response.json());
  } catch (e) {
    console.error(e);
  }
}*/
//form submission on clicking submit button 'save'
//document.addEventListener('DOMContentLoaded', function() {
  //works (server side?)
  /*form_server.addEventListener('submit', function(event) {
    event.preventDefault();
    console.log("trying to submit form");
    //if any of the inputs are invalid, do not submit the form
    sendData();
  });*/
  //trial (works only for client side)
  /*form_client.addEventListener('submit', function(event) {
    event.preventDefault();
    console.log("trying to submit form");
   
    sendData();
  });*/
//});
