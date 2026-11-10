

//checks if a given input matches valid regular expression 
//text: input string
//format: regular expression for this input
//output: returns true if input matches the regular expression
function validateRegExp(text,format){
  let is_matched;
  is_matched=text.match(format);//works
  //is_matched=format.match(text);// does not work
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
	//console.log("Error: "+input);
  throw new Error(input);
}

//checks if text in a input field is nonempty
//value:value in input field 
//field_name: name of name-field
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
   /*if(value!==undefined && value.trim() === '')
   {
     isValid=false;
     errorType(1,field_name);
     
   }*/
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
//flag: if true, perform regex match in reverse order
//return: true if this input is valid 
function isInputValid(value,format,field_name,isValidLength)
{
  let isValid=true;
  //document.getElementById('message').innerHTML="value of reg exp: "+validateRegExp(input.value);
  let m=validateRegExp(value,format);
  //console.log("eva: ");
  if(!validateRegExp(value,format))
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
    	console.log("input is valid");
    }
   }
  return isValid;
}

//function to validate a text in a given input field
//field_name: name of name-field
//value: value in name field
//min_length: minimum length of the text
//max_length: maximum length of the text
//condition: reg exp to be satisfiefd by input field
//return: true if name is correct or throw error if error occurs
const validateText= function(field_name,value,min_length=0,max_length="",condition=""){// to do: replace this by validateText func given in commonValidator.js
  //case 1: check that input field is non-empty
  let is_input_not_empty=isInputNonEmpty(value,field_name);
  //if input is non-empty
  let h;
  if(is_input_not_empty)
  {
    //check if input length is less than min value set for this field
    let f=isInputLengthValid(value,min_length,max_length);
    //case 2-4 and case 0:check non-empty input textfields for conforming to regular expression and adhere to minimum length constraint.Regular expression must start with 4 alphabets,then followed by alphabets,numbers,_   
    //let condition = /^[a-zA-Z]{4}[_a-zA-Z0-9]{2,}$/;
    h=isInputValid(value,condition,field_name,f);
  }
  else return is_input_not_empty;
  return h;

}

module.exports={
    isInputNonEmpty,
    isInputLengthValid,
    isInputValid,
    validateText
};