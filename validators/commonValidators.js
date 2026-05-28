

//checks if a given input matches valid regular expression 
//text: input string
//format: regular expression for this input
//flag: if true, perform regex match in reverse order
//output: returns true if input matches the regular expression
function validateRegExp(text,format,flag){
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

//checks if input field is nonempty
//value:value in input field 
//field_name: name of name-field
//return: true if this input field is empty 
function isInputNonEmpty(value,field_name)
{
   let isValid=true;
   //if input field is empty
   if(value.trim() === '')
   {
     isValid=false;
     errorType(1,field_name);
     
   }
   return isValid;
}

//checks if input has valid length
//value: value in input field 
//minm_length: minimum length for this input field
//return: true if this input length is greater than the minimum length set for this field
function isInputLengthValid(value,minm_length)
{
  let isValid=true;
  let trimmed_length=value.trim();
  if(trimmed_length.length<minm_length){
    isValid=false;
  }
  return isValid;
}

//checks if input field is valid 
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

module.exports={
    isInputNonEmpty,
    isInputLengthValid,
    isInputValid
};