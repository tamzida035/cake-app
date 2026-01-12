

//code to add text fields for alternative ingredients dynamically
var field_count=0;
//var total_fields=0;
var last_deleted_dyn_field=0;
var sequence_no=0;

//each dynamically added textfield can be removed. In that case, we have to generate new ones in circular order
var non_existent=0;
var used=1;
var free=2;

// Create a Map that stores state of each dynamic textfield
var dyn_field = new Map([
  ["1", non_existent],
  ["2", non_existent],
  ["3", non_existent]
]);


var MIN_INPUT_LENGTH=2;//to be deleted
function find_last_free_dyn_field()
{
  //case:find last dyn field no.It should be the free field,if it exists 
    for (const x of dyn_field.keys()){
    
        if(dyn_field.get(x)==free)
        {
          var key=parseInt(x);
          return key;
          //break;
        } 
     }

    
   //or, a textfield has not yet 'existed'
   for (const x of dyn_field.keys()){
    if(dyn_field.get(x)==non_existent)
    {
       var key=parseInt(x);
       return key;
    }
   }
   return -1;

}

function find_second_free_dyn_field()
{

  //case:if after deleting a field,only 1 field remain.Find that field
  var str=last_deleted_dyn_field.toString();
  var only_field=0;
  for (const x of dyn_field.keys())
  {
     if(x!=str)// if not the deleted field
     {
       if(dyn_field.get(x)==used)
       {
         only_field=parseInt(x);

       }
     }

  }
  var next_field=0;
  if(only_field==1)
  {
    return 2;

  }
  else if(only_field==2)
  {
    return 1;

  }
  else if(only_field==3)
  {
    return 1;
  }
  return last_deleted_dyn_field;
  
}



var yet_dyn_field_removed=false;
document.addEventListener('DOMContentLoaded', function() {
  
  document.getElementById('add_dynamic_field').addEventListener('click', function() {
    field_count++;
    //document.getElementById('message').innerHTML=field_count;
    if(field_count<=3){
      
      if(yet_dyn_field_removed==false)
      {
        sequence_no=field_count;

      }
      else
      {
        if(field_count==3)
        { 
          //the newly added element is the last of the 3 text fields. Therefore it must be the one not yet occuppied
          sequence_no=find_last_free_dyn_field();
         
        }
        else{
          //the newly added element is the 2nd text field to be added. It can be choosen in the order given inside this function
          sequence_no=find_second_free_dyn_field();

        }
      }
      
      //create root div inside which textfield and buttons will be nested "(original rootdiv)"
      var rootDiv=document.createElement('div');
      rootDiv.name="root_div";

      //form-group div
      var formDiv=document.createElement('div');
      formDiv.className="form-group";

      //create label
      var lbl = document.createElement('label');
      lbl.innerHTML="ALTERNATIVE INGREDIENT "+sequence_no;
      lbl.style.fontWeight = 'bold';
      //append the label to the formdiv
      formDiv.appendChild(lbl);

      // Create space
      var spaceDiv1 = document.createElement('div');
      spaceDiv1.className = 'row mb-3';
      //append space to the formdiv
      formDiv.appendChild(spaceDiv1);

      // Create the top level div element to format the column 1
      var toplevelDiv1=document.createElement('div');
      toplevelDiv1.className="col-md-4";

      // Create the next to top level div element
      var textDiv1 = document.createElement('div');
      textDiv1.className = 'contact_1ril';

      // Create the bottom level div element to hold the new input field
      var textDiv2 = document.createElement('div');
      textDiv2.className = 'border_light';

      // Create a new input element
      var newField = document.createElement('input');
      newField.type = 'text';
      newField.name = 'dynamicField'+sequence_no;
      newField.className="form-control border-0";
      newField.placeholder="ingredient";
      newField.minlength="2";
      //Regular expression starting with lower case or upper case alphabets but not with space and can have space in between the alphabets is following. also allow '
      //newField.pattern="[a-zA-Z'][a-zA-Z' ]*$";//works (original)
      //newField.pattern="[a-zA-Z][a-zA-Z ]+[a-zA-Z]$";// this WORKS

      //create a span field to display error message
      var spField = document.createElement('span');
      spField.id ='alt_ingred_error_msg'+sequence_no;
      spField.innerHTML="";

     
      // Append the new input element to the textDiv2
      textDiv2.appendChild(newField);

      
      //Append the divs containing the textfield to the form div
      formDiv.appendChild(toplevelDiv1).appendChild(textDiv1).appendChild(textDiv2);
      
      //append the error message field to the forrm div
      formDiv.appendChild(spField);
      

       // Create the top level div element to format the column 2 that will contain 'remove field' button
      var topLevelDiv2 = document.createElement('div');
      topLevelDiv2.className="col-md-10";
      topLevelDiv2.name="dynamic_field_remove";

      //create header of button
      var header=document.createElement('h6');
      header.className="text-center";

      //create button to remove text field
      var remove_btn=document.createElement('button');
      remove_btn.type="button";
      remove_btn.className="button b d-block rounded-0 button_small_size";
      remove_btn.name="remove_dynamic_field"+sequence_no;
      remove_btn.textContent="-";

      // add button to header
      header.appendChild(remove_btn);

      
      // Append the div containing the button to the formdiv
      formDiv.appendChild(topLevelDiv2).appendChild(header);


      //Append the formdiv to the root div
      rootDiv.appendChild(formDiv);

      // Append the root div to the form
      document.getElementById('tf_and_buttons').appendChild(rootDiv);

      // mark the first-time used dyn fields as used
      var num=sequence_no.toString();
      if(dyn_field.get(num)==non_existent||dyn_field.get(num)==free)
      {
        dyn_field.set(num,used);
      }
      

      remove_btn.addEventListener('click', function() {
        if(field_count>0)
        {
          if(field_count>3)
          {
            field_count=3;
            
          } 
          
          field_count--;
          rootDiv.remove();
            
          if(field_count==0)
          {
            yet_dyn_field_removed=false;
            for (const x of dyn_field.keys())
              dyn_field.set(x,non_existent);

          }
          else
          {
            if(yet_dyn_field_removed==false)
              yet_dyn_field_removed=true;

          }
         
          document.getElementById('message').innerHTML="";
         
          // find no of the deleted dynamic field
          for (var x of remove_btn.name){
            var possibleNum = parseInt(x);
            if (!Number.isNaN(possibleNum))
            {
              // mark it as free in the map
              if(dyn_field.get(x)==used)
                dyn_field.set(x,free);
                last_deleted_dyn_field=possibleNum;

            }
          }
        }
    
      });

   }
    else{
      document.getElementById("message").style.color = "red";
      document.getElementById('message').innerHTML="Maximum 3 alternative ingredients: "+field_count;
      
    }
    
  });
});

//check if character 'code' is alphabet
//returns true if so 
function isAlpha(code){
 
 return ((code >= 65 && code <= 90) || (code >= 97 && code <= 122));
}

//checks if a given input matches valid regular expression 
//input: string
//output: returns true if input matches the regular expression
function validateRegExp(text){
  //var condition = /^[a-zA-Z][a-zA-Z' ]*[a-zA-Z ]$/; //CORRECTED
  var condition = /^[a-zA-Z]+[']?[a-zA-Z ]*$/;
  if (!text.match(condition)) {
    return false;
  }
  var len=text.length;
  //apostrophe should be present only between 2 alphabets
  for (var x=0;x<len;x++)
  {
    var code = text.charCodeAt(x);
    if(code==39)
    { 
      if(x-1>=0)
      {
        var prev_code = text.charCodeAt(x-1);
        if(!isAlpha(prev_code))
        {
          return false;
        }
      }
      else{
        return false;
      }
      if(x+1<len)
      {
        var next_code = text.charCodeAt(x+1);
        if(!isAlpha(next_code))
        {
          return false;
        }

      }
      else{
        return false;
      }

    }

  }
  return true;
}

//isDynField: true if this input field is dynamically created.(TO BE DELETED)
//x: dynamic field number
//msg: error msg
//input:input field selected by query selector
//error_type: 1 if empty input; 2 if length  of input too short 3:if invalid input;0 if no error; 4 if input is too short and invalid
function printErrorMsg(isDynField,x,msg,input,error_type)
{
   //document.getElementById('message').innerHTML="outside err 2: "+isDynField+" "+x+" "+msg+" "+input+" "+error_type;
   var error_field_name="";
   var error_msg="";
   var field_name="";
   //document.getElementById('message').innerHTML="outside err 2: "+isDynField+" "+x+" "+msg+" "+input+" "+error_type;
  if(isDynField==true)
  {
    error_field_name='alt_ingred_error_msg'+x;
    error_msg=document.getElementById(error_field_name);
    if(error_type!=0) field_name="alternative ingredient ";
    else x="";
  }
  else
  {
    error_field_name='ingred_field_error_msg';
    error_msg=document.getElementById(error_field_name);
    if(error_type!=0) field_name="main ingredient ";
    else x="";
    //document.getElementById('message').innerHTML="inside err 2: "+error_type;
  }
  error_msg.style.color="green";
  // set error message for this field
  if(isDynField) error_msg.innerHTML=field_name+x+msg;
  else error_msg.innerHTML=field_name+msg;

  if(error_type!=0)
  {
    if(!input.classList.contains('highlight-textfield'))
      input.classList.add('highlight-textfield');
  } 

}
//input:input field selected by query selector(TO BE DELETED)
//isDynField: true if this input field is dynamically created.else, false
//return: true if this input field is empty 
function checkEmptyInput(input,isDynField)
{
   var isValid=true;
  // document.getElementById('message').innerHTML="is input bvalid "+isValid;
   //if input field is empty
   if(input.value.trim() === '')
   {
     isValid=false;
     //if its  dynamic field,find its no
     if(isDynField==true)
     {
      for (var x of input.name){
        var possibleNum = parseInt(x);
        if (!Number.isNaN(possibleNum))
        {
          printErrorMsg(isDynField,x," cannot be empty. Please write, eg egg",input,1);
        }
      }
     }
     else{
      printErrorMsg(isDynField,""," cannot be empty. Please write, eg egg",input,1);
     }

   }
   else{//set error msg field to empty
    //if its  dynamic field,find its no
     if(isDynField==true)
     {
       for (var x of input.name){
        var possibleNum = parseInt(x);
        if (!Number.isNaN(possibleNum)){
          printErrorMsg(isDynField,x,"",input,0);
        }
       }
     }
     else{
      
      printErrorMsg(isDynField,"","",input,0); 
     }
   }
  
   return isValid;
}

//input: input field selected by query selector
//return: true if this input is greater than minimum length set for thie field
function checkValidInputLength(input)
{
  var isValid=true;
  if(input.value.length<MIN_INPUT_LENGTH){
    isValid=false;
  }
   return isValid;
}

//input: input field selected by query selector
//isDynField: true if this input field is dynamically created.
//return: true if this input is valid 
function checkValidInput(input,isDynField,isValidLength)
{
  var isValid=true;
  //document.getElementById('message').innerHTML="value of reg exp: "+validateRegExp(input.value);
  if(!validateRegExp(input.value))
  {
    isValid=false;
     //if its  dynamic field,find its no
     if(isDynField==true)
     {
       for (var x of input.name){
        var possibleNum = parseInt(x);
        if (!Number.isNaN(possibleNum))
        {
          if(isValidLength) printErrorMsg(isDynField,x," does not meet input requirements",input,3);// case 3: invalid input
          else printErrorMsg(isDynField,x," does not meet input requirements and is too short",input,4); //case 4: input invalid and too short
        }
       }
     }
     else{
      if(isValidLength) printErrorMsg(isDynField,""," does not meet input requirements",input,3);// case 3: invalid input
      else printErrorMsg(isDynField,""," does not meet input requirements and is too short",input,4); //case 4: input invalid and too short
     }

  }
  else{
    if(isValidLength)// case 0: no error
    {
      //set error msg field to empty
      //if its  dynamic field,find its no
      if(isDynField==true)
      {
       for (var x of input.name)
       {
         var possibleNum = parseInt(x);
         if (!Number.isNaN(possibleNum))
          printErrorMsg(isDynField,x,"",input,0);
       }
      }
      else{
       printErrorMsg(isDynField,"","",input,0);
      }

    }
    else{
      // only input length is incorrect
      isValid=false;
      if(isDynField==true)
      {
       //document.getElementById('message').innerHTML="inside checkValidInput";
       for (var x of input.name){
         var possibleNum = parseInt(x);
         if (!Number.isNaN(possibleNum))
         {
           printErrorMsg(isDynField,x," input is too short (minimum 2 characters)",input,2);//case 2: input too short
         }
       }
     }
     else{
      //document.getElementById('message').innerHTML="inside checkValidInputtt 2";
      printErrorMsg(isDynField,""," input is too short (minimum 2 characters)",input,2);//case 2: input too short
         
     }
    
   }
 }
  return isValid;
}

//func validating the non dynamically generated field (ingredient field)
//return true if input in this field is valid 
function validateNonDynamicField()
{
   //document.getElementById('message').innerHTML="validaenOnDyn "+g;
   var input = document.querySelector('#dynamicForm input[name="ingred_field"]');
   

   //case 1: check that input textfield is non-empty
   var g=checkEmptyInput(input,false);
   if(g)// if input is non-empty
   {
     //check if input length is less than min value set for this field
     var f=checkValidInputLength(input);

     //case 2-4 and case 0:check non-empty input textfields for conforming to regular expression and adhere to minimum length constraint.Regular expression can start with alphabets, apostrophe 
     //but not with space and can have space in between the alphabets
     
     var h=checkValidInput(input,false,f);
     return h;

   }
   //document.getElementById('message').innerHTML="validaenOnDyn "+g;
   return g;
}


//func validating the dynamically generated fields(alternative ingredient field 1,2,3)
//return true if input in any or all(if exists) of these fields are valid (TO BE DELETED)
function validateDynamicFields() {
      
      var inputs = document.querySelectorAll('#dynamicForm input[name^="dynamicField"]');
      
      inputs.forEach(function(input) {
        // case 1: check that input textfields are non-empty
        var g=checkEmptyInput(input,true);
        if(g)// if input is non-empty
        {
          //check if input length is less than min value set for this field
          var f=checkValidInputLength(input);

          //case 2-4 and case 0:check non-empty input textfields for conforming to regular expression and adhere to minimum length constraint.Regular expression can start with alphabets, apostrophe 
          //but not with space and can have space in between the alphabets
          var h=checkValidInput(input,true,f);
          return h;
          
        }
        return g;
        
      });
      
    }

//check if an option is selected on radio button.If not, show error message 
function checkRadioButton()
{
  var options=document.querySelectorAll('#dynamicForm input[name="options"]');// works fine
  //var isSelected=false;
  var error_msg=document.getElementById("radio_field_error_msg");
  error_msg.style.color="green";
  for(const opt of options)
  {
    if(opt.checked)
    {
      var value=opt.value;
      error_msg.innerHTML="";
      return value;
    }
  }
  error_msg.innerHTML="Please select an ingredient status";
  return "";
}

//const form = document.getElementById('dynamicForm');// works with client side validation only
const form1 = document.querySelector("dynamicForm");//  works with server side validation only
//submit form to server (TO BE DELETED) (NOT NEEDED)
async function sendData() {
  //construct a formdata object for the form
    const fd = new FormData(form1);
    try {
    const response = await fetch(`https://localhost/admin/add_ingredients`, {
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
  //console.log("sendData");
  //this works
  /*new FormData(form).forEach( ( value, key ) => o[ key ] = value )
        await fetch(`https://localhost/admin/add_ingredients`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify( o )
        })
        .then( raw => raw.json())
        .catch( err => console.log(err));*/
}

// eventlistener on clicking submit button  //(TO BE DELETED)
//const form = document.getElementById('dynamicForm');// works with client side validation only
document.addEventListener('DOMContentLoaded', function() {
  //trial ( work only for server side)
  form1.addEventListener('submit', function(event) {
    event.preventDefault();
    var a=validateDynamicFields();
    var b=validateNonDynamicField();
    var c=checkRadioButton();
    //if any of the inputs are invalid, do not submit the form
    if(!a||(!b)||c=="")
      return;
    //sendData();
  });
  //original (works wit client side validation)
  /*form.addEventListener('submit', function(event) {
    //var b=validateNonDynamicField();
    console.log("I am here");
    
    // prevent the browser's built-in form submission, so we can take over. 
    event.preventDefault();
    // this funcs are not needed if server side validation is correctly performed (client side form validation)
    var a=validateDynamicFields();
    var b=validateNonDynamicField();
    var c=checkRadioButton();
    //if any of the inputs are invalid, do not submit the form
    if(!a||(!b)||c=="")
      return;
    //else
    //document.getElementById("message").innerHTML = "red";
    try
    {
     sendData();
    }
   catch{
    console.log('unfortu');
   }

    //form submission
    //sendData();//-->without this func call, form correctly submits
    
});*/
});




  
