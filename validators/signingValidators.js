const{
    isInputNonEmpty,
    isInputLengthValid,
    isInputValid
}=require("./commonValidators");

let MIN_DISPLAY_NAME_LENGTH=6;// MINM length of displayed name
let MIN_PASSWORD_LENGTH=8;// MINM length of password


//function to validate display name field
//field_name: name of name-field
//value: value in name field
//return: true if name is correct or throw error if error occurs
const validateName= function(field_name,value){
	//case 1: check that input field is non-empty
	let is_input_empty=isInputNonEmpty(value,field_name);
	//if input is non-empty
	let h;
    if(is_input_empty)
    {
      //check if input length is less than min value set for this field
      let f=isInputLengthValid(value,MIN_DISPLAY_NAME_LENGTH);

      //case 2-4 and case 0:check non-empty input textfields for conforming to regular expression and adhere to minimum length constraint.Regular expression must start with 4 alphabets,then followed by alphabets,numbers,_ and contain whitespaces as intermediate characters   
      //followed by alphabets,_,numbers
      let condition = /^[a-zA-Z]{4}[_a-zA-Z0-9 ]*$/;
      h=isInputValid(value,condition,field_name,f);
    }
    return h;

}

//function to validate email field
//field_name: name of email-field
//value: value in email field
//return: true if email is correct or throw error if error occurs
const validateEmail=function(field_name,value){
	//case 1: check that input field is non-empty
	let is_input_empty=isInputNonEmpty(value,field_name);
	//if input is non-empty
	let h;
    if(is_input_empty)
    {
      let f=true;
      //case 2: check that email id format is ok
      let condition = new RegExp(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/,"gm");
      h=isInputValid(value,condition,field_name,f);
    }
    return h;

}

//function to validate password field
//field_name: name of password-field
//value: value in password field
//return: true if password is correct or throw error if error occurs
const validatePassword=function(field_name,value){
	//case 1: check that input field is non-empty
	let is_input_empty=isInputNonEmpty(value,field_name);
	//if input is non-empty
	let h;
    if(is_input_empty)
    {
      //check if input length is less than min value set for this field
      let f=isInputLengthValid(value,MIN_PASSWORD_LENGTH);
      //Regular expression contains at least 2 alphabets and at least one number, underscore, or ‘?’
      let condition = /[a-zA-Z]{2,}[_0-9?]+|[_0-9?][a-zA-Z]{2,}$/;
      h=isInputValid(value,condition,field_name,f);
    }
    return h;

}

//function to validate confirm password field
//field_name: name of confirm password-field
//pwd: value in confirm password field
//value: value in confirm password field
//return: true if confirm password & password matches or throw error if error occurs
const validateConfirmPassword=function(pwd,value,field_name){
	//case 1: check that input field is non-empty
	let is_input_non_empty=isInputNonEmpty(value,field_name);
	//if input is non-empty
    if(is_input_non_empty)
    {
      //check if pasword and confir mpassword match
      //console.log("I am inside confirm pass");
      if(pwd!=value){
      	console.log('passwords do not match');
      	throw new Error('passwords do not match');

      } 
      
    }
    return true;

}



module.exports={
    validateName,
    validateEmail,
    validatePassword,
    validateConfirmPassword
};