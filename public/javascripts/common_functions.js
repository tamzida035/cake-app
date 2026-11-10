//this file contains functions to validate text fields on client side

//function to highlight a error if occurred 
//is_err: true if err occurred elsee false
//inputId: id of the input element
function highlightErrField(is_err,inputId)//let this func stay
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
function createSpecialHtmlElement(e_name,e_class_name,id="",text="",sty="",pla_hold="",maxlen=" ",minlen="")
{ 
  let e=createHtmlElement(e_name,e_class_name,id,sty,text);
  /*if(e_name==='b')
  {
    let t=document.createTextNode(text);
    e.appendChild(t);
  }*/
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
      //e.maxLength="20";
      e.maxLength=maxlen;
      e.minLength=minlen;
  }
  else if(e_name==="button")
  {
    e.setAttribute("type","button");
    e.required=true;
    e.name=id;
  }
  //else e=createHtmlElement(e_name,e_class_name,id,sty,text);
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
function printErrorMsg(msg,input_field,error_field_name,col_name="") // to do: add in common_funcrions.js
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
     printErrorMsg(msg,input_field,error_field_name);
     
   }
   else{
      //set error msg field to empty
      printErrorMsg("",input_field,error_field_name); 
   }
   return isValid;
}

//checks if text in a input field has valid length
//input_field: input field element
//return: true if this input length is greater than the minimum length set for this field
function isInputLengthValid(input_field)
{
  let trimmed_length=input_field.value.trim().length;
  //default minlength,maxlength=-1
  if((trimmed_length<input_field.minLength) ||(trimmed_length>input_field.maxLength)){
    console.log("length is: false");
    return false;
  }
  console.log("length is: true");
  return true;
}

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

//checks if text in a given input field is valid 
//input_field: input field selected by query selector
//format: regular expression for this input
//isValidLength: if this input has valid length
//input_field_name: name of the input field
//error_field_name: name of span field in html/pug where error message related to this input field will be displayed
//return: true if this input is valid 
function isInputTextValid(input_field,format,input_field_name,isValidLength,error_field_name)
{
  let isValid=true;
  //document.getElementById('message').innerHTML="value of reg exp: "+validateRegExp(input.value);
  if(format!==" ")
  {
    if(!validateRegExp(input_field.value,format))
    {
      isValid=false;
      if(isValidLength){
       let msg=input_field_name+" has invalid format";
       printErrorMsg(msg,input_field,error_field_name);// case 3: invalid input(does not meet regular expression)
      }
      else {
      let msg=input_field_name+" has invalid format and incorrect length";
      printErrorMsg(msg,input_field,error_field_name); //case 4: input invalid and length too short
      }
    }
    else{
      if(isValidLength)// case 0: no error
      {
        //set error msg field to empty
        printErrorMsg("",input_field,error_field_name);
      
      }
      else{
       // only input length is incorrect
       isValid=false;
       let msg=input_field_name+" length is incorrect";
       printErrorMsg(msg,input_field,error_field_name);//case 2: input too short 
      }
    }

  }
  else{
    if(isValidLength)// case 0: no error
    {
        //set error msg field to empty
        printErrorMsg("",input_field,error_field_name);
      
    }
    else{
       // only input length is incorrect
       isValid=false;
       let msg=input_field_name+" length is incorrect";
       printErrorMsg(msg,input_field,error_field_name);//case 2: input too short 
    }

  }
  
  return isValid;
}


//function to validate a text in a given input field
//input_field: input field element
//input_field_name: name of the input field
//error_field_name: name of the error field
//condition: reg exp to be satisfiefd by input field
//return: true if field is valid else return false  
const validateText= function(input_field,input_field_name,error_field_name,condition=""){// to do: replace this by validateText func given in commonValidator.js
  //case 1: check that input field is non-empty
  let is_input_not_empty=isInputNonEmpty(input_field,error_field_name,input_field_name);
  let h;
  if(is_input_not_empty)
  {
    //check if input length is less than min value set for this field
    let f=isInputLengthValid(input_field);
    h=isInputTextValid(input_field,condition,input_field_name,f,error_field_name);
  }
  else return is_input_not_empty;
  return h;
}

const isInputNumberValid= function(input_field,input_field_name,error_field_name)
{
  let value=input_field.value;
  let msg,num;
  num=Number.parseInt(value);
  if((input_field.min!=="" && num<input_field.min) || (input_field.max!=="" && num>input_field.max))
  {
      msg=input_field_name+"invalid number";
      printErrorMsg(msg,input_field,error_field_name);
      return false;
  }
  else{
      printErrorMsg("",input_field,error_field_name);
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
//let recipe_name=document.querySelector('#RecipeDetailsForm input[name="recipe_name_field"]');

//check if prep time/cooking time is valid
//return true if valid else false
//my_time_field:input field element
//my_time_err_field_name: name of error field of my_time
function isTimeValid(my_time_field,my_time_err_field_name)
{
  /*let is_err=false;
  if (my_time.validity.valueMissing) {
    // If empty
    is_err=true;
    my_time_err_msg.textContent = "must enter time duration";
  }
  else{
    console.log("orig value: "+my_time.value);
    //console.log("typeof: "+typeof(my_time.value));
    if(!isDurationFormatValid(my_time.value)){
      is_err=true;
      my_time_err_msg.textContent ="invalid format";
    }
    else{
      //console.log("enter here 1");
      my_time_err_msg.textContent = ""; 
    }

  }
  highlightErrField(is_err,my_time);
  return is_err;*/

  //case 1: check that input field is non-empty
  let is_input_not_empty=isInputNonEmpty(my_time_field,my_time_err_field_name);
  if(is_input_not_empty)
  {
    let is_valid=isDurationFormatValid(my_time_field.value);
    if(is_valid) printErrorMsg("",my_time_field,my_time_err_field_name);
    else printErrorMsg("invalid time format",my_time_field,my_time_err_field_name);
    return is_valid;
  }
  else return is_input_not_empty;
 
}

//**********************CODE TO DISPLAY RECIPE STEP AND INGREDIENTS**************
//get section title with no
//n: the nth section title
//return: a id generated for the nth section title
function getSectionTitleId(n)
{
   let name="sec_title"+n;
   return name;
}

//check that no of ingredient specified is in correct format
//err_msg: id of the paragraph field that display error message
//str: string containing the number (whole or fractional)
//return true if valid else reeturn false
function isNumberOfIngredientValid(str,err_msg)
{
  let no_err=true;
  //check that the first token is a str in number format: contains only numbers and '/'
  let is_valid_string =areCharactersValid(str,false,true,['/']);// common_functions.js
  if(is_valid_string===false)
  {
    //err_msg.textContent = "[a-zA-Z0-9],whitespaces,/,comma and +";
    err_msg.textContent="write whole or fractional number";
    no_err=false;
  }
  else{//0/2
    let fractional_no=str.split("/");
    //console.log("fractional array length: "+fractional_no.length);
    if(fractional_no.length===2)// fraction have  a numerator and  a denominators
    {
          let parsed_numerator=Number.parseInt(fractional_no[0]);
          let parsed_denominator=Number.parseInt(fractional_no[1]);
          //console.log("numer: "+fractional_no[0]);
          //console.log("fractional numera a number? : "+Number.isInteger(fractional_no[0]));
          //console.log("deno: "+fractional_no[1]);
          //console.log("fractional deno a number? : "+Number.isInteger(fractional_no[1]));
          if(parsed_numerator===NaN || parsed_denominator===NaN)
          {
            err_msg.textContent="invalid number format";
            no_err=false;

          }
          else if(parsed_numerator===0 || parsed_denominator===0)
          {
            err_msg.textContent="please enter non-zero value";
            no_err=false;

          }
     }
    else{
      //console.log("str length: "+str.length);
      if(fractional_no[0]===str)// whole number
      {
        let no=Number.parseInt(str);
        if(no===0)// 0 is invalid amount to enter
        {
          err_msg.textContent="please enter non-zero value";
          no_err=false;
        }
        else console.log("should return true");
      }
      else{
        err_msg.textContent="invalid number format";
        no_err=false;
      }
    }
        
  }
  //console.log(" return no+err: "+no_err);
  return no_err;

}

//check that unit of ingredient specified is in correct format
//err_msg: id of the paragraph field that display error message
//str: string containing the measuring unit
//ingred: json obbject containing {ingred_name,status, alternative ingred list}
//return true if valid else return false
function isUnitOfIngredientValid(str, err_msg,ingred)
{
  //let found=false;
  //special case: for eggs/eeggs: unit is L/M/S
  if(ingred.name=="egg" || ingred.name==="eggs")
  {
    let valid_units=['S','s','M','m','L','l'];
    for(let i=0;i<valid_units.length;i++)
    {
      if(str===valid_units[i]) return true;
    
    }
  }
  else{
   let valid_units=['oz','cup','cups','tsp','tbsp','ml','pt','gal','lb','pound'];//to do: create a webpage showing this and conversion between units
   for(let i=0;i<valid_units.length;i++)
   {
     if(str===valid_units[i]) return true;
   }
  }
  err_msg.textContent = "must enter an allowed measuring unit";
  return false;
}


//check that additional info about ingredient specified is in correct format
//err_msg: id of the paragraph field that display error message
//str: string containing the additional info
//return true if valid else return false
function isOptionalInfoValid(str, err_msg)
{
  let len=str.length;
  // valid format: (....) or ""
  if(str.trim()==="") return true;

  if(str==="()")
  {
    err_msg.textContent = "additional info: empty bracket";
    return false;
  }
  if(str[0]!=='(' || str[len-1]!==')')
  {
    err_msg.textContent = "additional info: missing bracket";
    return false;
  }
  return true;

}

//check if ingredient amount mentioned is valid
//err_msg: id of the paragraph field that display error message
//element_id; id of the input field that takes ingredient amount as input
//ingred: json obbject containing {ingred_name,status, alternative ingred list}
//return false if valid else return true
function isIngredientAmountValid(element_id,err_msg,ingred){
  let is_err=false;
  //let is_valid=true;
  let input=element_id.value;
  if(input.trim()==="")
  {
    err_msg.textContent = "must enter an amount";
    is_err=true;
  }
  else{
    //format: 1 tsp (melted, at room temperature)
    //format: 1/3 cup
    //format: 1 M/L/S (only for eggs)
    //amount field format: can contain alphabets,numbers, whitespaces,'/','+' and ','
    //discard if input contains invalid characters
    //if input contains any invalid characters, reject it
 
    //let is_valid_string =validateRegExp(val,RegEx);
    let valid_char_set=['/',',','(',')'];
    let is_valid_string =areCharactersValid(input,true,true,valid_char_set);// function given in common_functions.js module
    //console.log("is str valid: "+is_valid_string);
    if(is_valid_string===false)
    {
      //err_msg.textContent = "[a-zA-Z0-9],whitespaces,/,comma and +";
      err_msg.textContent="invalid character(s)";
      is_err=true;
    }
    else{
     //tokenize input
     let token_array=input.split(" ");
     /*console.log("token length: "+token_array.length);

     for(let i=0;i<token_array.length;i++)
     {
       console.log("token: "+token_array[i]);
     }*/
     //check if amount entered is valid number
     is_err=!isNumberOfIngredientValid(token_array[0],err_msg);
     if(!is_err)// number of ingred is valid
     {
       if(token_array.length>1)//check unit of ingredient
       {
        is_err=!isUnitOfIngredientValid(token_array[1],err_msg,ingred);

       }
       else// unit is missing
       {
        err_msg.textContent="specify measuring unit";
        is_err=true;

       }
     }

    if(!is_err)// unit specified by user is valid
    {
      //console.log("token array: "+token_array);
      if(token_array.length>2)// check if optional info is added by user
      {
        is_err=!isOptionalInfoValid(token_array[2],err_msg);

      }
    }
    //no error found
    if(!is_err) err_msg.textContent="";
      
   }

  }
  //console.log("before highlighting is_err: "+is_err);
  highlightErrField(is_err,element_id);
  return is_err;

}


