//function to highlight a error if occurred 
//is_err: true if err occurred elsee false
//inputId: id of the input element
function highlightErrField(is_err,inputId)
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
      //e=createHtmlElement(e_name,e_class_name,id,sty);
      //console.log("equip field inside specialElem: "+e);
      e.setAttribute("type","text");
      //e.placeholder="1 tsp(melted)";
      e.placeholder=pla_hold;
      e.required=true;
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

//function to add dynamic input fields
//Limit: maxm no of fields user is allowed to generate
//current_count: the no of existing fields
//par: id of the parent element to which the fields are attached
//prefix: prefix part of id of input field to be created
//limit_err_field_name: id of the html element that shows error msg when Limit is reached
// return: the no of existing fields
/*function addDynamicInputField(current_count,limit,par,prefix,limit_err_field_name)
{
	let limit_err_field=document.getElementById(limit_err_field_name);
	console.log("current_count: "+current_count);
	if(current_count<=limit)
	{
		let top_level,child_level1,child_level2,child_level3,child_level4,input_field;
		
		top_level=createHtmlElement('div',"row","top_level");

		//create line break
    let space_id="space_after_equip"+current_count;
    let space=createHtmlElement("div","row mb-3",space_id);
    par.appendChild(space);

		//add input field
    child_level1=createHtmlElement('div',"col-md-4");// parameterize?
    child_level2=createHtmlElement('div',"contact_1ril");// remove it when closing the modal
    child_level3=createHtmlElement('div',"border_light");
    
    let input_id=prefix+current_count;
    input_field=createSpecialHtmlElement('input',"form-control border-0",input_id,"","","1 9-inch cake form","15","3");
    top_level.appendChild(child_level1).appendChild(child_level2).appendChild(child_level3).appendChild(input_field);
    //par.appendChild(top_level);

    //add button to remove input field
    //let remove_equip_par_id="remove_equp_par"+current_count;
    child_level1=createHtmlElement('div',"col-md-4");// parameterize?
    child_level2=createHtmlElement('h6',"text-center");
    let btn_id="remove"+current_count;
    let remove_equip_btn=createSpecialHtmlElement("button","button b d-block rounded-0 button_small_size",btn_id,"-");
    top_level.appendChild(child_level1).appendChild(child_level2).appendChild(remove_equip_btn);

    //add error message field
    child_level1=createHtmlElement('div',"col-md-2");// parameterize?-=
    let err_id="err"+current_count;
    let err_field=createHtmlElement("p","col_green",err_id,"font-size: x-small;","NO ERR");
    top_level.appendChild(child_level1).appendChild(err_field);

    //add everything to topmost level
    par.appendChild(top_level);

    //if remove button is clicked, remove the input field,error field, remove button and added space from the parent node
    remove_equip_btn.addEventListener('click', function() {
    	let parent_level=document.getElementById("top_level");
    	parent_level.remove();
    	// show no msg in equip field limit error field
		  limit_err_field.textContent="";
		  if(current_count===6) current_count=5;
    	if(current_count!==0) current_count--;
    	console.log("after reemove current_count: "+current_count);
    	//return current_count;

    });
	}
	else{
		//display message that Limit has been reached
		limit_err_field.textContent="Maximum "+limit+" fields are allowed";
		current_count=5;
		console.log(" max limit current_count: "+current_count);
		
	}
	//console.log("return current_count: "+current_count);
	return current_count;

}*/