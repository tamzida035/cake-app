// this file contains code for client side validation of new user signing up
// to do: show this file in activity diagram



//prints error message 
//msg: error msg
//input:input field selected by query selector
//error_field_name: name of span field in html/pug where error message related to this input field will be displayed
//color_name: text color
//return: none
function printErrorMsg(msg,input,error_field_name,color_name="red")
{
   let error_msg=document.getElementById(error_field_name);
   error_msg.style.color=color_name;
   //set error message for this field
   error_msg.innerHTML=msg;

   if(msg!="")
   {
     if(!input.classList.contains('highlight-textfield'))
       input.classList.add('highlight-textfield');
   }
   else{
    if(input.classList.contains('highlight-textfield'))
      input.classList.remove('highlight-textfield');
   } 

}

//checks if input field is nonempty
//input:input field selected by query selector
//error_field_name: name of span field in html/pug where error message related to this input field will be displayed
//input_field_name: name of the input field
//return: true if this input field is empty 
function isInputNonEmpty(input,error_field_name,input_field_name)
{
   let isValid=true;
   //if input field is empty
   if(input.value.trim() === '')
   {
     isValid=false;
     let msg=input_field_name+" cannot be empty";
     printErrorMsg(msg,input,error_field_name);
     
   }
   else{
      //set error msg field to empty
      printErrorMsg("",input,error_field_name); 
   }
  
   return isValid;
}

//checks if input field has valid length
//input: input field selected by query selector
//minm_length: minimum length for this input field
//return: true if this input length is greater than the minimum length set for this field
function isInputLengthValid(input,minm_length)
{
  let isValid=true;
  let trimmed_length=input.value.trim();
  if(trimmed_length.length<minm_length){
    isValid=false;
  }
  return isValid;
}


//checks if a given input matches valid regular expression 
//text: input string
//format: regular expression for this input
//output: returns true if input matches the regular expression
function validateRegExp(text,format){
  //var condition = /^[a-zA-Z][a-zA-Z' ]*[a-zA-Z ]$/; //CORRECTED
  //let condition = /^[_a-zA-Z0-9]+[]*[a-zA-Z0-9]*$/;
  if (!text.match(format)) {
    return false;
  }
  return true;
}
//checks if input field is valid 
//input: input field selected by query selector
//format: regular expression for this input
//isValidLength: if this input has valid length
//input_field_name: name of the input field
//error_field_name: name of span field in html/pug where error message related to this input field will be displayed
//return: true if this input is valid 
function isInputValid(input,format,input_field_name,isValidLength,error_field_name)
{
  let isValid=true;
  //document.getElementById('message').innerHTML="value of reg exp: "+validateRegExp(input.value);
  if(!validateRegExp(input.value,format))
  {
    isValid=false;
    if(isValidLength){
     let msg=input_field_name+" has invalid format";
     printErrorMsg(msg,input,error_field_name);// case 3: invalid input(does not meet regular expression)
    }
    else {
      let msg=input_field_name+" has invalid format and is too short";
      printErrorMsg(msg,input,error_field_name); //case 4: input invalid and length too short
    }
  }
  else{
    if(isValidLength)// case 0: no error
    {
      //set error msg field to empty
      printErrorMsg("",input,error_field_name);
      
    }
    else{
      // only input length is incorrect
      isValid=false;
      let msg=input_field_name+" is too short";
      printErrorMsg(msg,input,error_field_name);//case 2: input too short
    
   }
 }
  return isValid;
}

//func validating text field
//return true if display name is valid 
function validateText()
{
  let MIN_DISPLAY_NAME_LENGTH=6;// MINM length of displayed name
	let input = document.querySelector('#UserRegisForm input[name="name_field"]');
  let error_field_name='name_field_error_msg';


  //case 1: check that input field is non-empty
  let g=isInputNonEmpty(input,error_field_name,"display name");
  if(g)// if input is non-empty
  {
     //check if input length is less than min value set for this field
     let f=isInputLengthValid(input,MIN_DISPLAY_NAME_LENGTH);

     //case 2-4 and case 0:check non-empty input textfields for conforming to regular expression and adhere to minimum length constraint.Regular expression must start with 4 alphabets,then followed by alphabets,numbers,_ and contain whitespaces as intermediate characters 
     let condition = /^[a-zA-Z]{4}[_a-zA-Z0-9 ]*$/;
     let h=isInputValid(input,condition,"display name",f,error_field_name);
     return h;

   }
   return g;
}



//func validating email field
//return true if email address is logically valid 
function validateEmail()
{
  let input = document.querySelector('#UserRegisForm input[name="email_field"]');
  let error_field_name='email_field_error_msg';
  //const email = document.querySelector("email_field");
  //case 1: check that input field is non-empty
  let g=isInputNonEmpty(input,error_field_name,"Email address");
  if(g)// if input is non-empty
  { 
     let f=true;
     //case 2: check that email id format is ok
     //let condition=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/; //(another email regex)(not verified)(does not work)
     //const condition = new RegExp(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/,"gm");
     let condition = /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+\.[a-zA-Z]{2,}$/;
     let h=isInputValid(input.value.trim(),condition,"Email address",f,error_field_name);
     return h;
  }
  return g;
}

//func validating password and then matching it with confirm password
//return true if password is valid & password & confirm passwords match
function validateAndMatchPasswords()
{
  let MIN_PASSWORD_LENGTH=8;// MINM length of password
  let pwd = document.querySelector('#UserRegisForm input[name="password_field"]');
  //let pwd = document.getElementById('UserRegisForm input[name="password_field"]');//works as well
  let pwd_error_field_name='password_error_msg';
  let h;
  //case 1: check that input field is non-empty
  let g1=isInputNonEmpty(pwd,pwd_error_field_name,"Password");
  if(g1)// if input is non-empty
  { 
     //check if input length is less than min value set for this field
     let f=isInputLengthValid(pwd,MIN_PASSWORD_LENGTH);

     //case 2-4 and case 0:check non-empty input textfields for conforming to regular expression and adhere to minimum length constraint.Regular expression contains at least 2 alphabets and at least one number, underscore, or ‘?’
     let condition = /[a-zA-Z]{2,}[_0-9?]+|[_0-9?]+[a-zA-Z]{2,}$/;
     h=isInputValid(pwd,condition,"Password",f,pwd_error_field_name);
     //return h;
  }
  if(h)
  {
    let confirm_pwd=document.querySelector('#UserRegisForm input[name="confirm_password_field"]');
    let pwd_confirm_error_field_name='confirm_password_error_msg';
    //case 1: check that input field is non-empty
    let g2=isInputNonEmpty(confirm_pwd,pwd_confirm_error_field_name,"confirm Password");
    if(g2)
    {
      if(pwd.value!==confirm_pwd.value)
      {
        printErrorMsg("passwords do not match ",confirm_pwd,pwd_confirm_error_field_name);

      }
    }
    return g2;

  }
  else return h;
  return g1;
}


//const form1 = document.getElementById('UserRegisForm');// works with client side validation only
const form1 = document.querySelector("UserRegisForm");//works with server side validation only
//eventlistener on clicking submit button 
//error_msg_field.innerHTML=document.readystate;
document.addEventListener('DOMContentLoaded', function() {
	//trial ( work only for server side)
  
	form1.addEventListener('submit', function(event) {
    event.preventDefault();
    
    //validate display name field
    /*let is_name_field_valid=validateText();
    let is_email_field_valid=validateEmail();
    let is_password_valid=validateAndMatchPasswords();
    
    //if any of the inputs are invalid, do not submit the form
    if(!is_name_field_valid|| !is_email_field_valid || !is_password_valid)
      return;*/
});
});