
//common user variables
let MIN_DISPLAY_NAME_LENGTH=6;// MINM length of displayed name
let MIN_PASSWORD_LENGTH=8;// MINM length of displayed name

//msg: error msg
//input:input field selected by query selector
//num: =1(input field is display name field),=2(input field is email field),=3(input field is password field), =4(input field is confirm password field)
//return: none
function printErrorMsg(msg,input,error_field_name)
{
   //document.getElementById('message').innerHTML="outside err 2: "+isDynField+" "+x+" "+msg+" "+input+" "+error_type;
   let error_msg=document.getElementById(error_field_name);
   error_msg.style.color="green";
   //set error message for this field
   error_msg.innerHTML=msg;

   if(msg!="")
   {
     if(!input.classList.contains('highlight-textfield'))
       input.classList.add('highlight-textfield');
   } 

}

//input:input field selected by query selector
//return: true if this input field is empty 
//error_field_name: name of error message display span field
const isInputNonEmpty= function(input,error_field_name)
{
   let isValid=true;
   //if input field is empty
   if(input.value.trim() === '')
   {
     isValid=false;
     printErrorMsg("Display name field cannot be empty",input,error_field_name);
     
   }
   else{
      //set error msg field to empty
      printErrorMsg("",input,error_field_name); 
   }
  
   return isValid;
}

module.exports={
	MIN_DISPLAY_NAME_LENGTH,
	MIN_PASSWORD_LENGTH,
	isInputNonEmpty,
};

