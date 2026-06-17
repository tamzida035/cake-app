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
	let is_input_not_empty=isInputNonEmpty(value,field_name);
	//if input is non-empty
	let h;
    if(is_input_not_empty)
    {
      //check if input length is less than min value set for this field
      let f=isInputLengthValid(value,MIN_DISPLAY_NAME_LENGTH);
      //case 2-4 and case 0:check non-empty input textfields for conforming to regular expression and adhere to minimum length constraint.Regular expression must start with 4 alphabets,then followed by alphabets,numbers,_   
      let condition = /^[a-zA-Z]{4}[_a-zA-Z0-9]{2,}$/;
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
	let is_input_non_empty=isInputNonEmpty(value,field_name);
	//if input is non-empty
	let h;
    if(is_input_non_empty)
    {
      let f=true;
      //case 2: check that email id format is ok
      //let condition=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/; //(another email regex)(does not work)
      //let condition = new RegExp(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/,"gm");
      let condition = /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+\.[a-zA-Z]{2,}$/;
      h=isInputValid(value.trim(),condition,field_name,f);
    }
    return h;

}

//function to validate password field
//field_name: name of password-field
//value: value in password field
//isLogin: true if password validation is done for user login, false for user sign up
//return: for user sign up, return true if password is correct or throw error if error occurs. for user login, return true if pssword is non-empty, else return false;
const validatePassword=function(field_name,value,isLogin=false){
	//case 1: check that input field is non-empty
  //console.log("i am here: ");
	let is_input_non_empty=isInputNonEmpty(value,field_name);
  if(isLogin) return is_input_non_empty;
  //console.log("after empty: "+is_input_non_empty);
	//if input is non-empty
	let h=false;
  if(is_input_non_empty)
  {
      //check if input length is less than min value set for this field
      let f=isInputLengthValid(value,MIN_PASSWORD_LENGTH);
      //Regular expression contains at least 1 one uppercase English letter,At least one lowercase English letter,At least one special character and At least one digit.
      let condition = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
      //console.log("just before ");//works
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
      if(pwd===undefined) 
      {
        throw new Error('Password in password field is invalid');
      }
      //check if pasword and confir mpassword match
      if(pwd!==value){
        /*console.log("1st password: "+pwd);
        console.log("2nd password: "+value);
      	console.log('passwords do not match');*/
      	throw new Error('Passwords do not match');
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