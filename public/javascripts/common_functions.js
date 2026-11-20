//this file contains functions to validate text fields on client side

//function to highlight a error if occurred 
//is_err: true if err occurred elsee false
//inputId: id of the input element
function highlightErrField(is_err,inputId)// to do: replace it by highlightErrField2
{
  if(is_err)
  {
    if(!inputId.classList.contains('highlight-textfield'))
      inputId.classList.add('highlight-textfield');

  } //recipe_name.classList.add("highlight-textfield");
  else{
    if(inputId.classList.contains('highlight-textfield'))
      inputId.classList.remove('highlight-textfield');
  }
}
//function to highlight a error if occurred 
//is_err: true if err occurred elsee false
//input_field: id of the input element
function highlightErrField2(is_err,input_field)//let this func stay
{
  if(is_err)
  {
    if(!input_field.classList.contains('is-invalid'))
     {
      if(input_field.classList.contains('is-valid')) input_field.classList.remove('is-valid');
      input_field.classList.add('is-invalid');
     }

  } //recipe_name.classList.add("highlight-textfield");
  else{
    if(input_field.classList.contains('is-invalid'))
    {
      input_field.classList.remove('is-invalid');
      if(!input_field.classList.contains('is-valid')) input_field.classList.add('is-valid');

    }
  }
}

//check if character 'code' is alphabet
//returns true if so 
function isAlpha(code){// copied from admin_dynamic_fields.js 
 
 return ((code >= 65 && code <= 90) || (code >= 97 && code <= 122));
}

//check if character 'code' is number
//returns true if so 
function isNumber(code){// copied from admin_dynamic_fields.js 
 
 return (code >= 48 && code <= 57);
}

//function to check if a string consists of valid character set
//str: string to be checked
//is_alpha: if true, perform alphabet check
//is_num: if true, preform number check
//char_Set: array containing characters to be checked against
function areCharactersValid(str,is_alpha,is_num,charset=[])
{
	let is_valid=true;
	
	for(let i=0;i<str.length;i++)
	{
	   let code=str.charCodeAt(i);
	   //ignore whitespace
	   if(code===32) continue;

	   //console.log("char: "+str[i]);
	   let flag;
	   if(is_alpha && is_num) flag=(!isNumber(code) && !isAlpha(code));
	   else if(is_alpha) flag=(!isAlpha(code));
	   else if (is_num) flag=(!isNumber(code));
	    
	   if(flag)
	   {
	   	 //console.log("entered inside flag");
	   	 let found=false;
	   	 for(let j=0;j<charset.length;j++)
	   	 {
	   	   //console.log("charset: "+charset[j]);
	   	   if(str[i]===charset[j])
	   	   {
	   	     found=true;
	   	 	 break;
	   	   }
	   	 }
	   	 if(found===false)
	   	 {
	   	 	is_valid=false;
	   	 	break;
	   	 }
	   }
	   //if(!is_valid) break;
	}
	//console.log("return: "+is_valid);
	return is_valid;
}

//function to create html elements
//e_name: name of html element to be created ('e.g. div','input','p','span','h1')
//e_class_name: name of class of e_name; 
//id: id of html element
//sty: style of html element
//text: textContent of html element, if that is 'p','span' or 'h'
//return: created html element e
function createHtmlElement(e_name,e_class_name,id="",sty="",text="")
{
	let e=document.createElement(e_name);
  e.className=e_class_name;
  e.id=id;
  e.name=id;
  e.style=sty;
  if(e_name!=='div' && e.name!=='input' && e_name!=='i') e.textContent=text;
  return e;
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
function createSpecialHtmlElement(e_name,e_class_name,id="",text="",sty="",pla_hold="",maxlen=" ",minlen="",pattern="")
{ 
  let e=createHtmlElement(e_name,e_class_name,id,sty,text);
  console.log(e_name+" "+e_class_name+" "+id+" "+maxlen+" "+minlen+" "+pattern);
  if(e_name==='i')
  {
      e.title="Alternative ingredient to "+text;
  }
  else if(e_name==='input')//write amount of ingredient
  {
    e.setAttribute("type","text");
    e.placeholder=pla_hold;
    //e.required=true;
    e.name=id;
    
    if(pattern!=="")
    {
      e.pattern=pattern;
      console.log("PATTERN assigned: "+e.pattern);
    }
    //else e.pattern=undefined;
    e.maxLength=maxlen;
    e.minLength=minlen;
    //console.log("e PATT: "+e.pattern);
  }
  else if(e_name==="button")
  {
    e.setAttribute("type","button");
    e.required=true;
    e.name=id;
  }
  return e;
}

//function to use a number from 'num' for use as part of id of html element such that this num is not yet assigned to 
//any other id
//num: represents range of numbers from 1 to num
//m: map to mark a number 1, if it is  already part of id else mark it as 0
//return: the first exisiting no that is not taken else return 0;
function getIdNumber(num,m)
{
	for (let i=1;i<=num;i++) {
    let value=m.get(i);
    if(value===0) return i;
  }
  /*for (const [key, value] of m) {
    //console.log(`${key}: ${value}`);
  }*/
  return 0;
}

//function to get id no from the id of an element
//id: element id
//return: the id no
function getNoFromId(id)
{
	let num;
	let index;
	for (let i=0;i<id.length;i++) {
		let code=id.charCodeAt(i);
		if(isNumber(code))
		{
			index=i;
			break;
		} 

	}
	console.log("no begins at i: "+index);
	//if(index!==undefined)
	{
		num=id.substring(index);
		console.log("substr: "+num);
	}
	return num;
}

//prints error message 
//msg: error msg
//input_field:input field selected by query selector
//error_field_name: name of span field in html/pug where error message related to this input field will be displayed
//color_name: text color
//return: none
function printErrorMsg(msg,input_field,error_field_name,col_name="") // to do: replace it by printErrorMsg2
{
   let error_msg=document.getElementById(error_field_name);
   error_msg.innerHTML=msg;
   if(col_name!=="") error_msg.style.color=col_name;
   if(msg!=="")
   {
     if(!input_field.classList.contains('highlight-textfield'))
       input_field.classList.add('highlight-textfield');
   }
   else{
    if(input_field.classList.contains('highlight-textfield'))
      input_field.classList.remove('highlight-textfield');
   } 
}

//prints error message 
//msg: error msg
//input_field:input field selected by query selector
//error_field_name: name of span field in html/pug where error message related to this input field will be displayed
//color_name: text color
//return: none
function printErrorMsg2(msg,input_field,error_field_name,col_name="") // to do: add in common_funcrions.js
{
   let error_msg=document.getElementById(error_field_name);
   error_msg.textContent=msg;
   if(col_name!=="") error_msg.style.color=col_name;
  
    if(msg!=="")//there is error
    {
      if(!input_field.classList.contains('is-invalid'))
      {
       if(input_field.classList.contains('is-valid')) input_field.classList.remove('is-valid');
       input_field.classList.add('is-invalid');
      }
    }
    else//no error
    {
      if(input_field.classList.contains('is-invalid'))
      {
       input_field.classList.remove('is-invalid');
       if(!input_field.classList.contains('is-valid')) input_field.classList.add('is-valid');

      }
    } 
   
}
//prints error message for photo field
//msg: error msg
//photo_status_field:element showing error status of photo field
//no_err: true, if there is no error, otherwise false
function printErrorMsgForPhotoField(msg,photo_status_field,no_err)
{
  photo_status_field.textContent=msg;
  if(!no_err)//error
  {
    if(!photo_status_field.classList.contains('col_red'))
    {
       if(photo_status_field.classList.contains("col_green")) photo_status_field.classList.remove("col_green");
       photo_status_field.classList.add('col_red');
    }
  }
  else{//error
    if(!photo_status_field.classList.contains("col_green"))
    {
       if(photo_status_field.classList.contains("col_red")) photo_status_field.classList.remove("col_red");
       photo_status_field.classList.add("col_green");
    }
  }

}


//checks if input field is nonempty
//input_field:input field selected by query selector
//error_field_name: name of span field in html/pug where error message related to this input field will be displayed
//input_field_name: name of the input field
//return: true if this input field is nonempty else return false
function isInputNonEmpty(input_field,error_field_name,input_field_name="")// to do: add in common_funcrions.js
{
   let isValid=true;
   //if input field is empty
   if(input_field.value.trim() === '')
   {
     isValid=false;
     let msg=input_field_name+" cannot be empty";
     printErrorMsg2(msg,input_field,error_field_name);
     
   }
   else{
      //set error msg field to empty
      printErrorMsg2("",input_field,error_field_name); 
   }
   return isValid;
}

//checks if text in a input field has valid length
//input_field: input field element
//return: true if this input length is greater than the minimum length set for this field
function isInputLengthValid(input_field)
{
  let trimmed_length=input_field.value.trim().length;
  if((trimmed_length<input_field.minLength) ||(trimmed_length>input_field.maxLength)){
    console.log("length is: false");
    return false;
  }
  console.log("length is: true");
  return true;
}

//checks if a given input matches valid regular expression 
//input_field: input field selected by query selector
//output: returns array if input value matches the regular expression else returns null
function validateRegExp(input_field){
  console.log("value: "+input_field.value+" pattern: "+input_field.pattern);
  console.log("match: "+input_field.value.match(input_field.pattern));
  return input_field.value.match(input_field.pattern);//works
  
}

//checks if text in a given input field is valid 
//input_field: input field selected by query selector
//isValidLength: if this input has valid length
//input_field_name: name of the input field
//error_field_name: id of span field in html/pug where error message related to this input field will be displayed
//show_remaining_char: true if u want to display remaining characters in a input field
//return: true if this input is valid 
function isInputTextValid(input_field,input_field_name,isValidLength,error_field_name,show_remaining_char=false)
{
  let isValid=true;
  console.log("INPUT PATTERN in textvalid: "+input_field.pattern);
  if(input_field.pattern!==undefined)
  {
    //console.log("I should not enter here");
    if(validateRegExp(input_field)===null)
    {
      isValid=false;
      if(isValidLength){
       let msg=input_field_name+" has invalid format";
       printErrorMsg2(msg,input_field,error_field_name);// case 3: invalid input(does not meet regular expression)
      }
      else {
      let msg=input_field_name+" has invalid format and incorrect length";
      printErrorMsg2(msg,input_field,error_field_name); //case 4: input invalid and length too short
      }
    }
    else{
      if(isValidLength)// case 0: no error
      {
        //set error msg field to empty
        printErrorMsg2("",input_field,error_field_name);
      
      }
      else{
       // only input length is incorrect
       isValid=false;
       let msg=input_field_name+" length not within limit";
       printErrorMsg2(msg,input_field,error_field_name);//case 2: input too short 
      }
    }

  }
  else{
    if(isValidLength)// case 0: no error
    {
      console.log("equip should enter here");
      if(show_remaining_char)// display remaining char for textarea
      {
          let remaining_char=parseInt(input_field.maxLength)-input_field.value.trim().length;
          let msg="Characters remaining: "+remaining_char;
          printErrorMsg2(msg,input_field,error_field_name);
      } 
      else printErrorMsg2("",input_field,error_field_name);   
      
    }
    else{
      console.log("SEEMS equip should enter here");
       // only input length is incorrect
       isValid=false;
       let msg=input_field_name+" length is incorrect";
       printErrorMsg2(msg,input_field,error_field_name);//case 2: input too short 
    }

  }
  console.log("should return True");
  return isValid;
}


//function to validate a text in a given input field
//input_field: input field element
//input_field_name: name of the input field
//error_field_name: id of the error field
//is_field_optional:true if this text field is optional else set false
//show_remaining_char: true if u want to display remaining characters in a input field
//return: true if field is valid else return false  
const validateText= function(input_field,input_field_name,error_field_id,is_field_optional=false,show_remaining_char=false){// to do: replace this by validateText func given in commonValidator.js
  //case 1: check that input field is non-empty
  let is_input_not_empty;
  if(!is_field_optional) is_input_not_empty=isInputNonEmpty(input_field,error_field_id,input_field_name);
  if(is_input_not_empty|| is_field_optional)
  {
    //check if input length is less than min value set for this field
    let f=isInputLengthValid(input_field);
    return isInputTextValid(input_field,input_field_name,f,error_field_id,show_remaining_char);
  }
  return is_input_not_empty;
}


//function to check if no in a given input field is valid
//input_field: input field element
//input_field_name: name of the input field
//error_field_name: name of the error field

const isInputNumberValid= function(input_field,input_field_name,error_field_name)
{
  let value=input_field.value;
  let msg,num;
  num=Number.parseInt(value);
  if((input_field.min!=="" && num<input_field.min) || (input_field.max!=="" && num>input_field.max))
  {
      msg=input_field_name+"invalid number";
      printErrorMsg2(msg,input_field,error_field_name);
      return false;
  }
  else{
      printErrorMsg2("",input_field,error_field_name);
      return true;
  }
  
}


//function to validate a number in a given input field
//input_field: input field element
//input_field_name: name of the input field
//error_field_name: name of the error field
//min_length: minimum length of the text
//max_length: maximum length of the text
//return: true if field is valid else return false 
const validateNumber= function(input_field,input_field_name,error_field_name){// to do: replace this by validateText func given in commonValidator.js
  //case 1: check that input field is non-empty
  let is_input_not_empty=isInputNonEmpty(input_field,error_field_name,input_field_name);
  //case 2: if input field is npn-empty, check that the no is valid
  if(is_input_not_empty) return isInputNumberValid(input_field,input_field_name,error_field_name);
  return is_input_not_empty;
}

//************TIME VALIDATION FUNCS**************
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

//check if prep time/cooking time is valid
//return true if valid else false
//my_time_field:input field element
//my_time_err_field_name: name of error field of my_time
function isTimeValid(my_time_field,my_time_err_field_name)
{
  //case 1: check that input field is non-empty
  let is_input_not_empty=isInputNonEmpty(my_time_field,my_time_err_field_name);
  if(is_input_not_empty)
  {
    let is_valid=isDurationFormatValid(my_time_field.value);
    if(is_valid) printErrorMsg2("",my_time_field,my_time_err_field_name);
    else printErrorMsg2("invalid time format",my_time_field,my_time_err_field_name);
    return is_valid;
  }
  else return is_input_not_empty;
 
}

//**********************CODE FOR RECIPE STEP AND INGREDIENTS**************
//get section title with no
//n: the nth section title
//return: a id generated for the nth section title
function getSectionTitleId(n)
{
   let name="sec_title"+n;
   return name;
}

