

//checks if a given input matches valid regular expression 
//text: input string
//format: regular expression for this input
//output: returns array if input value matches the regular expression else returns null
function validateRegExp(text,format){
  let is_matched=text.match(format);//works
  //let is_matched=text.test(format);
  return is_matched;
}

//throws error
//num: error number.If num=2, input format is invalid. if num=3, input format is invalid and too short. if num=4, input is too short
//field_name: name of the input field
//value: value in input field
//return: throws error
function errorType(num,field_name,value="")
{
	let input=field_name;
	if(value!="") input+=': '+value;
  //num value 1: applicable both for texts, numbers
  //num value 2: applicable both for texts, times
  //num value 3-4: applicable for texts only
  //num value 5: applicable for numbers only
	if(num==1)// empty input
	{
		input+=" cannot be empty";
	}
	if(num===2)//input has invalid format
	{
		input+=' has invalid format';
        
	}
	else if(num===3)// input has invalid format and shorter than minimum length criteria
	{
        input+=" has invalid format and is too short";
	}
	else if(num==4)//input is smaller than minimum length criteria
	{
		input+=" is too short";
	}
  else if(num==5)//number is invalid
  {
    input+=" invalid number";
  }
	//console.log("Error: "+input);
  throw new Error(input);
}

//checks if text in a input field is nonempty
//value:value in input field 
//field_name: name of input-field
//return: true if this input field is empty 
function isInputNonEmpty(value,field_name)
{
   let isValid=true;
   //if input field is empty
   if(value===undefined || (value!==undefined && value.trim() === ''))
   {
    isValid=false;
    errorType(1,field_name);
   }
   return isValid;
}

//checks if text in a input field has valid length
//value: value in input field 
//minm_length: minimum length for this input field
//maxm_length: maximum length of the text
//return: true if this input length is greater than the minimum length set for this field
function isInputLengthValid(value,minm_length=0,maxm_length="")
{
  let trimmed_length=value.trim();
  if((trimmed_length.length<minm_length) ||(maxm_length!=="" && trimmed_length.length>maxm_length)){
    return false;
  }
  return true;
}

//checks if text in a input field is valid 
//value: value in input field
//format: regular expression for this input
//isValidLength: if this input has valid length
//field_name: name of input field
//return: true if this input is valid 
function isInputValid(value,format,field_name,isValidLength)//to do: rename func to isInputTextValid
{
  let isValid=true;
  //document.getElementById('message').innerHTML="value of reg exp: "+validateRegExp(input.value);
  let m=validateRegExp(value,format);
  //console.log("eva: ");
  if(validateRegExp(value,format)===null)
  {
    isValid=false;
    if(isValidLength){
      //console.log("Inside validlength 1");
    	errorType(2,field_name);
    }
    else {
      //console.log("Inside error invalidlength 1");
      errorType(3,field_name);
    }
  }
  else{
    if(!isValidLength)// case 0: no error
    {
      // only input length is incorrect
      isValid=false;
      //console.log("Inside error invalidlength 2");
      errorType(4,field_name);
      
    }
    else{

    	console.log("text is valid");
    }
   }
  return isValid;
}

//function to validate a text in a given input text field
//field_name: name of the field
//value: value in the field
//min_length: minimum length of the text
//max_length: maximum length of the text
//condition: reg exp to be satisfiefd by input text field
//is_field_optional:true if this text field is optional else set false
//return: true if name is correct or throw error if error occurs
const validateText= function(field_name,value,min_length=0,max_length="",condition="",is_field_optional=false){
  //case 1: check that input field is non-empty
  let is_input_not_empty;
  if(!is_field_optional) is_input_not_empty=isInputNonEmpty(value,field_name);
  //if input is non-empty
  if(is_input_not_empty|| is_field_optional)
  {
    //check if input length is less than min value set for this field
    let f=isInputLengthValid(value,min_length,max_length);
    //case 2-4 and case 0:check non-empty input textfields for conforming to regular expression and adhere to minimum length constraint.Regular expression must start with 4 alphabets,then followed by alphabets,numbers,_   
    //let condition = /^[a-zA-Z]{4}[_a-zA-Z0-9]{2,}$/;
    return isInputValid(value,condition,field_name,f);
  }
  return is_input_not_empty;

}

//function to check if no in a given input field is valid
//field_name: name of the input field
//value: value in the field
//min: minimum no allowed in this field
//max: maximum no allowed in this field
//return: true if field is valid else return false 
const isInputNumberValid= function(value,field_name,min,max)
{
  //let value=input_field.value;
  let msg,num;
  num=Number.parseInt(value);
  if(num<min || num>max)
  {
    errorType(5,field_name);
    return false;
  }
  else{
    console.log("number is valid");
    return true;
  }
  
}

//function to validate a number in a given input field
//field_name: name of the input field
//value: value in the field
//min: minimum no allowed in this field
//max: maximum no allowed in this field
//return: true if field is valid else return false 
const validateNumber= function(field_name,value,min=0,max=Number.MAX_VALUE){
  //case 1: check that input field is non-empty
  let is_input_not_empty=isInputNonEmpty(value,field_name);
  //case 2: if input field is npn-empty, check that the no is valid
  if(is_input_not_empty) return isInputNumberValid(value,field_name,min,max);
  return is_input_not_empty;
}


module.exports={
    isInputNonEmpty,
    isInputLengthValid,
    isInputValid,
    validateText,
    validateNumber,
    errorType,
};