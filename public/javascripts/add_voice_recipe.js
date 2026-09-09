//let requirejs = require('requirejs');
let recognizing;
let speech_recog = new webkitSpeechRecognition();
//speech_recog.continuous = true;//Controls whether continuous results are returned for each recognition, or only a single result.
//speech_recog.interimResults = true;//Controls whether interim results should be returned (true) or not (false.) Interim results are results that are not yet final
//reset();
recognizing = false;
//speech_recog.onend = reset;
let final_transcript;
let section_title,r_step;
let overall_step_no,current_section_step_no;
let has_step_has_section_title;


//discard recipe uttered so far and reset to original settings
function resetRecipeToInitialState()
{
  section_title="";
  final_transcript = "";
  r_step="";
  overall_step_no=0;
  current_section_step_no=0;

}

//discard a recipe section
 function resetSectionData()
 {
   section_title="";
   r_step="";
   overall_step_no-=current_section_step_no;
   current_section_step_no=0;
   final_transcript = "";
 }

//discard a recipe step and also section_title(if any)
//this_step_has_section_title: true if current step begins with section title else false
function resetRecipeStep(this_step_has_section_title)
{
  //section_title="";
  final_transcript = "";
  if(this_step_has_section_title) resetSectionData();
  //recipe_step--;
  //recipe_step="";

}

resetRecipeToInitialState();

//reset the toggle 'start/stop' button to initial state(start state)
function reset() {
    recognizing = false;
    //document.getElementById("status").style.display = "none";
    document.getElementById("status").innerHTML="Stopped listening";
    document.getElementById('start_btn').innerHTML ="Start";
    
  }
//reset between steps of a recipe
function intermediateReset() {
    recognizing = false;
    //document.getElementById("status").style.display = "none";
    document.getElementById('start_btn').innerHTML ="Start";
    //document.getElementById("status").innerHTML="Stopped listening";
    
  }



//note: write down supporting browser for all the speech recog event function
//called by recog.start function
speech_recog.onstart = () => {
    document.getElementById("status").style.display = "block";
    document.getElementById("status").innerHTML="started listening";
};

//fired when speech recognition error occurs
speech_recog.onerror = (event) => {
    //document.getElementById("status").style.display = "block";
    document.getElementById("status").innerHTML= event.error;

};

//called by recog.stop func
speech_recog.onend = () => {
    //document.getElementById("status").style.display = "block";
    document.getElementById("status").innerHTML="Stopped listening";
    intermediateReset();
 };

 //function to identify ingredients from recipe step
function identifyIngredients()
{

}

//function to process user speech into section title (if any), recipe step
//return 1: if there is invalid recipe step (INVALID FORMAT)
//return 2: if there is valid section title (or no section title) followed by valid recipe step (VALID FORMAT)
//return 3: if there is invalid section title(INVALID FORMAT)
//return 4: if first step is wrongfully uttered as 'next' step (INVALID FORMAT)
//return 5: if next step is wrongfully uttered as 'first' step (INVALID FORMAT)
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
        //find the position of the first match of 'first'
        let pos_first=final_transcript.search('first');
        if(pos_first===-1)
        {
          //invalid recipe step format
          return 1;
        }
        section_title+=final_transcript.substring(10,pos_first);//index no after 'steps for' is 10
        console.log("section_title: "+section_title);
        r_step=final_transcript.substring(pos_first+6);//skip 'first' and whitespace
        console.log("recipe_step: "+r_step); 
        if(r_step==="")
        {
          //invalid recipe step format
          return 1;
        }
        return 2;
        //console.log("recipe_step: "+r_step);  
        //document.getElementById("status").style.display = "block";
        //document.getElementById("status").innerHTML="section title: "+section_title+" step_no: "+recipe_step+" step: "+r_step;

      }
      //invalid section title format
      return 3;
       
   }
   else//there is no section title
   {
     let no,pos_step,is_first;
     no=final_transcript.search('first');

     //'first' word is missing
     if(no===-1)
     {
       //then check if 'next' is present
       pos_step=final_transcript.search('next');
       is_first=false;
     }
     else{
       pos_step=no;
       is_first=true;
     } 
     //check if recipe step is valid
     if(pos_step!==-1)//'next' word is uttered at appropriate position in speech
     {
        //extract the recipe step
        r_step=final_transcript.substring(pos_step+5);
        //nothing is utterer after 'net'
        if(r_step==="")
        {
          //invalid recipe step format
          return 1;
        }
        //check if first step is indeed first one and so for next step
        if(current_section_step_no+1===1)
        {
          if(is_first) return 2;
          return 4;
        }
        else{
          if(!is_first) return 2;
          return 5;
        }
        return 2;  
      }
      //invalid recipe step format
      return 1;       
    } 

}

//The result event of the Web Speech API is fired when the speech recognition service returns a result — a word or phrase has been positively recognized and this has been communicated back to the app
speech_recog.onresult = (event) => {
    //let interim_transcript = "";
    let value;
    for (let i = event.resultIndex; i < event.results.length; ++i) 
    {
      //console.log(event.results[i][0].transcript);
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
        
        //display user speech in modal
        const modal = document.getElementById('confirm_modal');
        //set visibility to modal
        modal.style.display="block";
        let msg=document.getElementById('modal_msg');
        let confirm_btn=document.getElementById("confirm_btn");
        //check if user speech is valid
        let num=processUserSpeech();
        if(num===2) 
        {
          msg.innerHTML=final_transcript;
          let span1 = document.createElement('span');
          span1.className='col_green';
          span1.innerHTML='--VALID FORMAT';
          msg.appendChild(span1);
        }
        else
        {
          msg.innerHTML=final_transcript;
          //msg.style.color='red';
          let span1 = document.createElement('span');
          span1.className='col_red';
          if(num===1) span1.innerHTML='--INVALID RECIPE STEP FORMAT';
          else if(num===3) span1.innerHTML='--INVALID SECTION TITLE FORMAT';
          else if(num===4)  span1.innerHTML='--FIRST STEP MUST BEGIN WITH FIRST KEYWORD';
          else if(num===5)  span1.innerHTML='--SUBSEQUENT STEP MUST BEGIN WITH NEXT KEYWORD';
          msg.appendChild(span1);

          //display msg in modal footer
          let footer=document.getElementById('modal_footer_note');
          //to do: confirm cannot be disabled as intented (correct it)
          confirm_btn.disabled = true;
          confirm_btn.style.color='#DCDCDC';
          footer.innerHTML="Note: Only correctly formatted speech is stored as recipe "+confirm_btn.disabled;

        }
        resetRecipeToInitialState();

        
        // case 1: if user has confirmed the speech
        if(!confirm_btn.disabled)
        {
          confirm_btn.addEventListener("click", function () 
          {
            modal.style.display = "none";
            //store this step with its no and section title(if any)

            overall_step_no++;
            resetRecipeStep();
          });

        }
        

        //case 2: user has discarded step
        let close_btn=document.getElementById("close_btn");
        close_btn.addEventListener("click", function () {
          modal.style.display = "none";
          
        });
         
        //console.log("final_transcript1: "+final_transcript);
        //if there is section title
        /*if(final_transcript.startsWith('steps'))
        {
          console.log("1 enter");
          if(final_transcript.startsWith('steps for'))
          {
            //console.log("2 enter");
            //find the position of 'steps for'
            let pos_steps_for=final_transcript.search('steps for');
            //find the position of the first match of 'first'
            let pos_first=final_transcript.search('first');
            console.log("pos of steps for: "+pos_steps_for);
            console.log("pos of first: "+pos_first);
            section_title+=final_transcript.substring(10,pos_first);//index no after 'steps for' is 10
            console.log("section_title: "+section_title);
            let r_step=final_transcript.substring(pos_first+6);//skip 'first' and whitespace
            console.log("recipe_step: "+r_step);
            
            document.getElementById("status").style.display = "block";
            document.getElementById("status").innerHTML="section title: "+section_title+" step_no: "+recipe_step+" step: "+r_step;

           }
           else{
            //console.log("3 enter");
            //invalid section title
            //openModal() //toDo
           }
        }
        else{
          let pos_step=final_transcript.search('next');
          //valid recipe step (supposing)
          if(pos_step!==-1)
          {
            //extract the recipe step
            r_step=final_transcript.substring(pos_step+5);
            if(r_step==="")
            {
              //invalid recipe step format
              console.log("invalid recipe step format: did not utter step");
              //openModal() //toDo
            }
            else{
              console.log("step no recipe_step: "+recipe_step+" "+r_step);
              document.getElementById("status").style.display = "block";
              document.getElementById("status").innerHTML="step_no: "+recipe_step+" step: "+r_step;
              //openModal() //toDo

            }

          }
          else{//invalid recipe step
            console.log("invalid recipe step format");
            //openModal() //toDo
          }

          
        }*/
      /*else {
        interim_transcript += event.results[i][0].transcript;
        document.getElementById("textarea_field").style.color = "LightCoral";
        document.getElementById("textarea_field").innerHTML = interim_transcript;
      }*/
    }
  }
  };




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



//code to use
document.addEventListener('DOMContentLoaded', function(event) {
	console.log("DOM fully loaded and parsed"); 
	document.getElementById('start_btn').addEventListener('click', function() {
  	//document.getElementById("textarea_field").innerHTML ='Hello';
  	if(!recognizing)//start speech to text conversion
  	{
  		recognizing=true;
  		speech_recog.start();
      document.getElementById('start_btn').innerHTML="Stop";
  		console.log("started button");
  	}
    else// stop conversion
    {
      //recognizing=false;
      speech_recog.stop();
      reset();
      console.log("ended button");
      
    }

  });

  /*document.getElementById('clear_btn').addEventListener('click', function() {
  	document.getElementById('textarea_field').innerHTML= "";
    reset_recipe_step();
  });*/

});