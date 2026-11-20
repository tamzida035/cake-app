const {
    isInputNonEmpty,
    errorType,
}=require("./commonValidators");

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

//check if time duration entered by user in time field is valid
//value:value in time field
//return true if valid else false
function isDurationFormatValid(value)// 0 min/hr, 0 hr 0 min should not be allowed
{
  //discard any non-alphanumeric characters
  let RegEx = /^[a-z0-9 ]+$/i;
  let val = value.trim(); 
  //console.log("trimmed value: "+val);
  let is_input_alphanumeric = RegEx.test(val);
  //console.log("value of reg test: "+is_input_alphanumeric);
  if(!is_input_alphanumeric) return false;
  else{
    //tokenize input
    let token_array=val.split(" ");
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

//check if time is valid
//return true if valid else false
//value:value in time field
//field_name: name of input-field
//return: true if time is valid else throw error
function isTimeValid(value,field_name)
{
  //case 1: check that input field is non-empty
  let is_input_not_empty=isInputNonEmpty(value,field_name);
  let msg;
  if(is_input_not_empty)
  {
    //case 2: since time field is non-empty, check if duration format is valid
    let is_valid=isDurationFormatValid(value);
    if(is_valid) return is_valid;
    errorType(2,field_name);
  }
}

module.exports={
    isTimeValid,
};