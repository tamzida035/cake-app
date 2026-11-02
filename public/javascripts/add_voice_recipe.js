//let requirejs = require('requirejs');
let recognizing;
let speech_recog = new webkitSpeechRecognition();
//speech_recog.continuous = true;//Controls whether continuous results are returned for each recognition, or only a single result.
//speech_recog.interimResults = true;//Controls whether interim results should be returned (true) or not (false.) Interim results are results that are not yet final
//reset();
recognizing = false;
//speech_recog.onend = reset;
let final_transcript,ingredients_list;//ingredients_list: list of ingredients from the database
let section_title,prev_section_title;//title of current & previous section of recipe
let recipe_text;// recipe step
let num;// refers to type of error in user speech format
let modal;//user speech is displayed in modal
let footer;//display msg in modal footer
let overall_step_no;
let current_section_step_no,prev_section_step_no;// no of steps in current & previous section of recipe
let this_step_has_section_title,is_ingredient_list_available;
let prev_section_ingre;//ingredients belonging to current & previous section_title(default=no title)
//let prev_iden_ingre;//most recent identified ingredients under the current section title
let identified_ingredients=new Array();//identify the ingredients from user transcript under the current section title
let map_ingre=new Map();//map of identified ingredients under the current section title
let map_section_title=new Map();//map of section titles already stated by user
let confirm_btn=document.getElementById("confirm_btn");// confirm button to confirm user speech 
let reset_btn=document.getElementById("reset_recipe_btn");//reset button 
let finish_btn=document.getElementById("finish_recipe_btn");
let full_recipe=new Array();//contains full recipe in json
let temp_recipe,temp_text,temp_section_title,temp_ingre;
//let msg=document.getElementById('modal_msg');

function commonReset()
{
  final_transcript = "";
  current_section_title="";
  if(confirm_btn!==null) confirm_btn.disabled = false;
  temp_text=temp_section_title=temp_ingre=undefined;
}

//clears ingredients and total no of steps shown in display area
function clearDisplayArea()
{
  /*let parent_of_display_ingred=document.getElementById("identified_ingred");
  parent_of_display_ingred.textContent="";*/
  for (let i in full_recipe) 
  {
    console.log("removed "+i);
    let child1=document.getElementById("space1"+i);
    if(child1!==null) child1.remove();

    let child2=document.getElementById("section_title"+i);
    if(child2!==null) child2.remove();

    let child3=document.getElementById("space2"+i);
    if(child3!==null) child3.remove();

    let child4=document.getElementById("total_steps");
    if(child4!==null) child4.remove();

  }
  /*if(is_reset)
  {
    let status=document.getElementById("display_ingred_area_title");
    status
  }*/
}
//discard recipe uttered so far and reset to original settings
function resetRecipeToInitialState()
{
  //current_section_title="";//default section_title
  prev_section_title="";
  commonReset();
  clearDisplayArea();
  full_recipe=[];
  overall_step_no=current_section_step_no=0;
  reset_btn.disabled=true;
  finish_btn.disabled=true;

}

//discard a recipe section (not needed)
//is_discard: true if the current recipe section should be discarded else false
 function resetSectionData(is_discard=true)
 {
  commonReset();
  if(is_discard){
   overall_step_no-=current_section_step_no;
   current_section_step_no=0;
  }
 }

//discard a recipe step and also section_title(if any)
//this_step_has_section_title: true if current step begins with section title else false
function resetRecipeStep()
{
  commonReset();

}

//way 2
//get ingredients list from database
//return: ingredient list as object, or error if error occurs.If list is empty, return appropriate message
async function getIngredientsList()
{
  try{
    let response=await fetch("https://localhost:443/users/get_all_ingredients");
    const ingredients = await response.json();
    return ingredients;

  }
  catch(err){
    //console.error('Error fetching data:', err);
    return err;// or put Error handler here?
  }
}

ingredients_list=getIngredientsList();
console.log("ing list: "+ingredients_list);

resetRecipeToInitialState();
//returns true if current step is first ever step else returns false
function isFirstEverStep()
{
  return (overall_step_no===1);
}

//set variables before a recipe steps(with or no section_title)
//return true if new step is beginning of new section else return false;
function beforeEachRecipeStep()
{
  overall_step_no++;
  let is_new_section;
  //case 1:current section has title
  if(current_section_title!=="")
  {
    //case 1a: prev section has no title
    if(prev_section_title==="") //overallfirst step of recipe
    {
      //start of new section
      current_section_step_no=1;
      console.log("I am at correct place");
      is_new_section=true;
    }
    else{//case 1b: prev section has title
      
      if(current_section_title!==prev_section_title)//different section titles
      {
        //start of new section
        current_section_step_no=1;
        is_new_section=true;
      }
      else{//may happen in rare cases
        //same section continues;
        current_section_step_no++;
        is_new_section=false;
      }

    }
  }
  else//case 2:current section has no title
  {
    
    if(isFirstEverStep())//new section starts
    {
      current_section_step_no=1;
      is_new_section=true;
      current_section_title="Main";
      //prev_section_title="none";
       
    }
    else{
      //same section continues;
      current_section_step_no++;
      is_new_section=false;
      current_section_title=prev_section_title;// not sure

    }

    //return false;
    //case 2a: prev section has no title (2a,2b are same)
    /*if(prev_section_title==="")
    {
      //same section continues;
      current_section_step_no++;

    }
    else{//case 2b: prev section has title
      //same section continues;
      current_section_step_no++;

    }*/

  }
  if(is_new_section)
  {
    map_ingre.clear();//reset map of ingredients
    identified_ingredients=[];//clear the list of identified ingredients under previous section title
    temp_recipe={};// not sure

  }
  clearDisplayArea();
  //console.log("is_new_section? "+is_new_section);
  return is_new_section;
  
}

//set variables before a recipe steps(with or no section_title)
function afterEachRecipeStep()
{
  prev_section_title=current_section_title;
  console.log("prev recipe title after each step: "+prev_section_title);
  commonReset();
}

//get ingredients list from database
//return: ingredient list as object
//way 1
/*function getIngredientsList1()
{
   //send a request to server to get ingredients list from the database
  fetch("https://localhost:443/users/get_all_ingredients")
  // When recieved, exposes the JSON component
  .then((response) => {
    //console.log("Forbidden area1: "+response.json());
    let data= response.json();
    console.log("data in response: "+data);
    return data;
  })
  // Displays the message on the page
  .then((ingredients_list) => { 
    console.log("ingred: "+ingredients_list);
    return ingredients_list;
    //let extracted_ingredients=extractIngredientsFromSpeech(ingredients_list);  
  })
  .catch(error =>{
    console.log('Error fetching data:', error);
    return error;
  });
}*/

//search for all ingredients in user transcript
function extractIngredientsFromSpeech(ingre)
{
    for (let key1 in ingre) 
    {
      if (ingre.hasOwnProperty(key1)) 
      {
          let value = ingre[key1];
          let item=new RegExp(value.name, "i");
          //search the main ingredient in user speech
          let found_ingredient=final_transcript.search(item);
          //console.log("ingredient: "+value.name);
          if(found_ingredient!=-1)
          {
            console.log("Found match: "+value.name);
            if(!map_ingre.has(item))
            {
              identified_ingredients.push(value);
              //mark it in map
              map_ingre.set(value.name,1);

            }

          }

      }
    } 
}

//store recipe(section title,step no, step,ingredients) and ingredients identified so far
//is_new_section:true if this is a new section(with or without title)
//to do: "first add sugar" "next add water" does not add water to ingre list and 2nd step (CHECK)
function storeRecipeData(is_new_section)
{
  if(is_new_section)
  {
    //if current section has no title, write 'main' in section-title of json object
    //store section_title only once in json object
    if(!map_section_title.has(current_section_title))
    {
        map_section_title.set(current_section_title,1);
        temp_recipe={
          'section_title': current_section_title,
        };
                
    }

    let text={
    'text': recipe_text,
    };
    //temp_recipe['text']=recipe_text;
    temp_recipe['steps']=[text];
    if(identified_ingredients.length===0) temp_recipe['ingredients']=[{'name':'none'}];
    else temp_recipe['ingredients']=identified_ingredients;

    full_recipe.push(temp_recipe);
  }
  else //if continuation of prev section
  {
    //add recipe text to 'steps' of prev section
    cur_sec_title=prev_section_title;
    console.log("current sec title inside storage: "+cur_sec_title);
    for (let i in full_recipe) 
    {
      let element1=full_recipe[i];
      //console.log("object 1: "+full_recipe[i]);
      let found_title=false;
      for (let key in element1)
      {
        //console.log("key: "+key);
        let value = element1[key];
        if(key==='section_title'){

          //console.log("section title: "+value);
          if(value===prev_section_title)
          {
            found_title=true;
          }
        }
        else if(key==='steps')//this should be an array
        { 
          //console.log("obj.txt: "+value.text);
          if(found_title)
          {
            let text={'text': recipe_text,};
            value.push(text);
            //console.log("pushed text");
          }

        }
        else{
         //update the ingredient list
         if(found_title){
          //let ing=element1[key];
          //if(ing.name==='none') element1[key]=[{'name':'none'}];
          element1[key]=identified_ingredients;
          //console.log("updated ingred");
          break;
         }

        }

      }
      if(found_title) break;
    }
  }
  
  console.log("temp_recipe");
  console.log(temp_recipe);
  console.log("full_recipe");
  console.log(full_recipe);
  //print full_recipe
  /*for (let i in full_recipe) 
  {
    let element1=full_recipe[i];
    console.log("object 1: "+full_recipe[i]);
    for (let key in element1)
    {
      console.log("key: "+key);

      let value = element1[key];
      if(key==='section_title') console.log("value: "+value);
      else if(key==='steps')//this should be an array
      {
        //console.log("obj.txt: "+value.text);
        for (let j in value)
        {
          let element2=value[j];
          console.log("obj.txt: "+element2.text);

        }

      }
      else{
        for (let key2 in value)
        {
          console.log("object 1: "+key2);
          if(value.hasOwnProperty(key2))
          {
             let value2 = value[key2];
             console.log("object 3: "+value2.name+" "+value2.status+" "+value2.alternative_ingredients);
             for(let key3 in value2.alternative_ingredients)
             {
              let value3=value2.alternative_ingredients[key3];
              console.log("alternative ingred: "+value3);
             }
          }

        }

      }
      
    }
      
    }*/
}



//******************google wep api functions*********************************

//reset the toggle 'start/stop' button to initial state(start state)
function resetButton() {
    recognizing = false;
    //document.getElementById("status").style.display = "none";
    document.getElementById("start_btn_status").innerHTML="Stopped listening";
    document.getElementById('start_btn').innerHTML ="START";
    
  }
//reset between steps of a recipe
function intermediateReset() {
    recognizing = false;
    //document.getElementById("status").style.display = "none";
    document.getElementById('start_btn').innerHTML ="START";
    //document.getElementById("status").innerHTML="Stopped listening";
    
  }

//note: write down supporting browser for all the speech recog event function
//called by recog.start function
speech_recog.onstart = () => {
    document.getElementById("start_btn_status").style.display = "block";
    document.getElementById("start_btn_status").innerHTML="started listening";
};

//fired when speech recognition error occurs
speech_recog.onerror = (event) => {
    //document.getElementById("status").style.display = "block";
    document.getElementById("start_btn_status").innerHTML= event.error;

};

//called by recog.stop func
speech_recog.onend = () => {
    //document.getElementById("status").style.display = "block";
    document.getElementById("start_btn_status").innerHTML="Stopped listening";
    intermediateReset();
 };


//function to process user speech into section title (if any), recipe step
//return 1: if there is invalid recipe step (INVALID FORMAT)
//return 2: if there is valid section title (or no section title) followed by valid recipe step (VALID FORMAT)
//return 3: if there is invalid section title(INVALID FORMAT)
//return 4: if first step is wrongfully uttered as 'next' step (INVALID FORMAT)
//return 5: if next step is wrongfully uttered as 'first' step (INVALID FORMAT)
//return 6: if current section title already exists
//return 7: if user has uttered preserved section title MAIN as new section title
function processUserSpeech()
{
  //check if there is section title
  if(final_transcript.startsWith('steps'))
  {
      //if section title is valid
      if(final_transcript.startsWith('steps for'))
      {
        //find the position of 'steps for'
        let pos_steps_for=0;
        //find the position of the first match of 'first'.make the search case-insensitive
        let item=new RegExp('first',"i");
        let pos_first=final_transcript.search(item);
        if(pos_first===-1)
        {
          //invalid recipe step format
          return 1;
        }
        current_section_title+=final_transcript.substring(10,pos_first);//index no after 'steps for' is 10
        /*if(map_section_title(current_section_title).get()===0) map_section_title.set(current_section_title,1);
        else return 6;*/
        console.log("section_title: "+current_section_title);
        recipe_text=final_transcript.substring(pos_first+6);//skip 'first' and whitespace
        console.log("recipe_step: "+recipe_text); 
        if(recipe_text==="")
        {
          //invalid recipe step format
          return 1;
        }
        else if(current_section_title==="main") return 7;
        else if(map_section_title.has(current_section_title)) return 6;
        return 2;

      }
      //invalid section title format
      return 3;
       
   }
   else//there is no section title
   {

     let no,is_next,is_first;
     no=final_transcript.startsWith('first');
     //console.log("here because first is present");
     //'first' word is missing
     if(!no)
     {
       //then check if 'next' is present
       is_next=final_transcript.startsWith('next');//true or false
       is_first=false;
       console.log("next is correct");
     }
     else{
       //console.log("here because first is present");
       //pos_step=no;
       is_first=true;
     } 
     //check if recipe step is valid
     if(is_first===true)//'first' word is uttered at appropriate position in speech
     {
        //console.log("here because next is present");
        //extract the recipe text
        recipe_text=final_transcript.substring(6);
        //nothing is utterer after 'net'
        if(recipe_text==="")
        {
          //invalid recipe step format
          return 1;
        }
        //check if first step of current section is indeed first one
        if(current_section_step_no+1===1)
        {
          return 2;
          //return 4;
        }
        else{
          //if(!is_first) return 2;
          return 5;
        } 
      }
      else if(is_first===false)//'next' word is uttered at appropriate position in speech
      {
        if(is_next===false) return 1;
        //console.log("here because next is present");
        //extract the recipe step
        recipe_text=final_transcript.substring(5);
        console.log("recipe_step: "+recipe_text); 
        //nothing is uttered after 'next'
        if(recipe_text==="")
        {
          //invalid recipe step format
          return 1;
        }
        //check if next step of current section is non-first one indeed
        if(current_section_step_no+1!==1)
        {
          return 2;
          //return 4;
        }
        else{
          return 4;
        } 
      }     
    } 

}

//The result event of the Web Speech API is fired when the speech recognition service returns a result — a word or phrase has been positively recognized and this has been communicated back to the app
speech_recog.onresult =(event) => {
    //let interim_transcript = "";
    let value,span1;
    //display msg in modal footer
    footer=document.getElementById('modal_footer_note');
    //console.log("footer: "+footer);
    let msg=document.getElementById('modal_msg');
    for (let i = event.resultIndex; i < event.results.length; ++i) 
    {
      //console.log(event.results[i][0].transcript);
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
        
        //display user speech in modal
        modal = document.getElementById('confirm_modal');
        //set visibility to modal
        modal.style.display="block";
        
        //check if user speech is valid
        num=processUserSpeech();
        console.log("returrned num: "+num);
        if(num===2) 
        {
          msg.innerHTML=final_transcript;
          span1=createHtmlElement('span','col_green',"","",'--VALID FORMAT');
          msg.appendChild(span1);
        }
        else
        {
          msg.innerHTML=final_transcript;
          let err_msg;
          if(num===1) err_msg='--INVALID RECIPE STEP FORMAT';
          else if(num===3) err_msg='--INVALID SECTION TITLE FORMAT';
          else if(num===4)  err_msg='--FIRST STEP MUST BEGIN WITH FIRST KEYWORD';
          else if(num===5)  err_msg='--SUBSEQUENT STEP MUST BEGIN WITH NEXT KEYWORD';
          else if(num==6) err_msg='--THIS SECTION ALREADY EXISTS';
          else if(num==7) err_msg='--MAIN REFERS TO DEFAULT SECTION TITLE.THIS WORD IS PRESERVED';
          span1=createHtmlElement('span','col_red',"","",err_msg);
          msg.appendChild(span1);

          //to do: confirm cannot be disabled as intented (correct it)
          confirm_btn.disabled = true;
          confirm_btn.style.color='#DCDCDC';
          footer.innerHTML="Note: Only correctly formatted speech is stored as recipe "+confirm_btn.disabled;

        }  
        
    }
  }
  };

//display the ingredients with section title(if any)
let parent_of_display_ingred=document.getElementById("identified_ingred");
let at_least_one_ingre=false;
//let child1,child2,child3;
// case 1: if user has confirmed the speech
if(confirm_btn!==null && !confirm_btn.disabled)
{
    confirm_btn.addEventListener("click", function () 
    {
      modal.style.display = "none";
      if(footer!==null) footer.innerHTML="";
      //let identified_ingredients_list;

      //if user confirms valid format,proceed as follows 
      if(num===2)
      {    
        //set variables before a recipe step
        let is_new_section=beforeEachRecipeStep();
        if(overall_step_no!==0)
        {
          reset_btn.disabled=false;
        }
        //identify the ingredients from user transcript
        //access the ingredients list
        ingredients_list.then((ingre)=>{
          let message1;
          let parent=document.getElementById("db_list");
          //if ingredients db is empty or error occurred in ingredients db
          if(ingre.msg!==undefined){
              message1=ingre.msg;
              console.log("valuedd.msg: "+message1);
          }
          else{
            //extract the ingredients from user speech
            extractIngredientsFromSpeech(ingre);
          }

          //store recipe data collected so far
          storeRecipeData(is_new_section);

          //display the ingredients with section title(if any)(TO DO: put this in a function)
          [parent_of_display_ingred,at_least_one_ingre]=writeOnDisplayArea(parent_of_display_ingred,at_least_one_ingre,message1);//imported from display_recipe_functions.js
          
          //if recipe contains at least 1 ingredient, user can save the recipe
          if(at_least_one_ingre) finish_btn.disabled=false;
          console.log("at least 1 ingred: "+at_least_one_ingre);
          //update variables after each recipe step
          afterEachRecipeStep();
        });
            
      }

    });
}       
        
//case 2: user has discarded step
let close_btn=document.getElementById("close_btn");
if(close_btn!==null)
{
  close_btn.addEventListener("click", function () {
  modal.style.display = "none";
  //msg.removeChild(span1);
  if(footer!==null) footer.innerHTML="";
  resetRecipeStep();
  });

}


//reset recipe to initial state
reset_btn.addEventListener("click", function () {
  resetRecipeToInitialState();
  let status=document.getElementById("reset_btn_status");
  status.innerHTML='recipe cleared!';
});


//displayrecipe details in a form when finish button is clicked
finish_btn.addEventListener("click", function () {
  //display ingredient list(this function is in recipe_details.js module)
  displayIngredientsList();
  //display full recipe 
  displayFullRecipe();
  
});


//fired when end of speech is detected(feature not available in all browers) (DOES NOT WORK)
 /*speech_recog.onspeechend = () => {
  //speech_recog.stop();
  // if there is section title
  if(final_transcript.startsWith('steps'))
  {
  	if(final_transcript.startsWith('steps for'))
  	{
  		//find the position of the first match of 'first'
  		let pos=final_transcript.search('first');

  		section_title+=final_transcript.substring(10,pos);//index no after 'first step ' is 10
  		let r_step=final_transcript.substring(pos+5);
      document.getElementById("status").style.display = "block";
      document.getElementById("status").innerHTML="section title: "+section_title+" step: "+r_step;

  	}
  	else //invalid format of voice cmd
  	{
  	

  	}

  }
  console.log("Speech recognition has stopped. "+final_transcript.startsWith('steps')+" text:"+final_transcript);
  reset();
};*/


//button to start recording recipe
document.addEventListener('DOMContentLoaded', function(event) {
	console.log("DOM fully loaded and parsed"); 
	document.getElementById('start_btn').addEventListener('click', function() {
  	//document.getElementById("textarea_field").innerHTML ='Hello';
  	if(!recognizing)//start speech to text conversion
  	{
  		recognizing=true;
  		speech_recog.start();
      document.getElementById('start_btn').innerHTML="STOP";
  		console.log("started button");
  	}
    else// stop conversion
    {
      //recognizing=false;
      speech_recog.stop();
      resetButton();
      console.log("ended button");
      
    }

  });

});
