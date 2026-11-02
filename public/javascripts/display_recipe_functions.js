
//function to show so-far identified ingredients (with section-title) to user
//parent_of_display_ingred: id of parent elemnt containing the display elements
//at_least_one_ingre: true if at least one inggre has been found so far in the recipe and false otherwise
//message1: data returned by fetch
//return: at_least_one_ingre
function writeOnDisplayArea(parent_of_display_ingred,at_least_one_ingre,message1)
{
	//console.log("came inside new file");
	for (let i in full_recipe) 
    {
       //console.log("iteration no: "+i);
       let div_id="space1"+i;
       let child1=createHtmlElement("div","row mb-3",div_id);
     
       parent_of_display_ingred.appendChild(child1);
       let element1=full_recipe[i];
       for (let key in element1)
       {
          //console.log("key: "+key);
          let value = element1[key];
          if(key==='section_title')
          {
            //display section_title(if any)
            let msg="Recipe section name: "+value;
            let div_id2="section_title"+i;
            let child2=createHtmlElement("h5","",div_id2,"color:#FF00FF;",msg);
            parent_of_display_ingred.appendChild(child2);
          } 
          else if(key==="ingredients"){
           let combine_ingre;
           let j=0;
           for (let key2 in value)
           {
             //console.log("object 1: "+key2);
             if(value.hasOwnProperty(key2))
             {
               let ingred = value[key2];
               j++;
               if(j===1)
               {
                 combine_ingre=ingred.name;
                 if(combine_ingre!=='none') at_least_one_ingre=true;
               }
               else combine_ingre+=(", "+ingred.name);
               //console.log("object 3: "+value2.name+" "+value2.status);
              }
            } 
            let div_id2="recipe_ingredients"+i;
            let child3;
                
            if(message1===undefined)
            {
              //display recipe ingredients
              child3=createHtmlElement("p","",div_id2,"color:#FDF5E6;",combine_ingre);
              child1.id="space2"+i;
              parent_of_display_ingred.appendChild(child1).appendChild(child3);
            }
            else{
              //display special message
              child3=createHtmlElement("p","",div_id2,"color:#FDF5E6;",message1);
              parent_of_display_ingred.appendChild(child1).appendChild(child3);
             }
           }
        }
    }
    //display total no of recipe steps so far
    let msg="total no of steps in recipe: "+overall_step_no;
    let child2=createHtmlElement("p","status_font_size","total_steps","color:#006400;",msg);
    parent_of_display_ingred.appendChild(child2);

    return [parent_of_display_ingred,at_least_one_ingre];
}

//function to display section title in recipe detail
//parent_node: node to attach the created nodes to
//value:value to display
//id: id number of the section_title
//is_ingre_list: true if this section title will be displayed under List of ingred title, false if under recipe title
//return: mddified pareent_node
function displaySectionTitleInRecipeDetail(parent_node,id,value,is_ingre_list)
{
  //display section title
  let child_level1,child_level2,sec_title_field,sty;
  let new_id;
  if(is_ingre_list)
  {
  	new_id="InList"+id;
  	//sty="background:lavender;";
  } 
  else{
  	new_id="InRecipe"+id;
  	//sty="background:PaleGreen;";
  } 
  child_level1=createHtmlElement('div',"row",new_id);
  child_level2=createHtmlElement('div',"col-md");// adjust width of sec name column
  //child_level2.style="background:lavender;";

  let title="SECTION NAME: "+value;
  sec_title_field=createHtmlElement('span',"col_red",id,"",title);
  //sec_title_field=createHtmlElement('h6',"section_title_col",id,"",title);

  parent_node.appendChild(child_level1).appendChild(child_level2).appendChild(sec_title_field);
  return parent_node;
}

//display ingredient list
function displayIngredientsList()
{
  let par_ingre_list=document.getElementById("ingred_list");
  let div_id;
  for (let i in full_recipe) 
  {
    let element1=full_recipe[i];
    let id=getSectionTitleId(i+1);
    //console.log("object 1 inside recipe_detail: "+full_recipe[i]);
    for (let key in element1)
    {
      //console.log("key: "+key);
      let value = element1[key];
      if(key==='section_title')
      {  
        //display section title
        par_ingre_list=displaySectionTitleInRecipeDetail(par_ingre_list,id,value,true);//imported from display_recipe_functions.js
        
      }
      else if(key==='ingredients')
      {
        let j=0;
        for (let key2 in value)
        {
          //console.log("object 1: "+key2);
          if(value.hasOwnProperty(key2))
          {
            j++;
            let ingred = value[key2];
            //console.log("object 3: "+value2.name+" "+value2.status);
            let child_level1,child_level2,child_level3,child_level4,child_name;

            //display ingredient name(OK)
            div_id="ingre_name_root"+j;
            child_level1=createHtmlElement('div',"row",div_id);// remove it when closing the modal
            child_level2=createHtmlElement('div',"col-md-3");
            //highlight the mushbooh and haram ingredients
            let col="";
            if(ingred.status==='Haram') col="haram_col";
            else if(ingred.status==='Mushbooh') col="mushbooh_col";
            let ingre_name=j+". "+ingred.name;
            let ingre_name_field=createSpecialHtmlElement("b",col,id,ingre_name);
            child_level1.appendChild(child_level2).appendChild(ingre_name_field);

            //display alternative ingredients(if any)
            child_level3=createHtmlElement('div',"col-md-4");
            let alt_ingre_name_field,alt_ingred_name;
            alt_ingred_name=" ";
            let k=0;
            let no_alt_ingre=false;
            for(let key3 in ingred.alternative_ingredients)
            {
              let alt_ingred=ingred.alternative_ingredients[key3];
              if(alt_ingred===null)
              {
                no_alt_ingre=true;
                break;
              }
              k++;
              if(k===1) alt_ingred_name+=alt_ingred;
              else alt_ingred_name+=(", "+alt_ingred);
              
            }
            if(no_alt_ingre) alt_ingre_name_field=createHtmlElement("span",col);
            else
            {
              console.log("Alt ingre are: "+alt_ingred_name);
              //<i class="bi bi-arrow-right-square-fill"></i>
              let icon=createSpecialHtmlElement("i","bi bi-arrow-right-square-fill alternative_ingred_col","",ingred.name,'font-size:20px;');
              child_level3.appendChild(icon);
              alt_ingre_name_field=createHtmlElement("span","alternative_ingred_col","","",alt_ingred_name);
            }
            child_level3.appendChild(alt_ingre_name_field);
            child_level1.appendChild(child_level3);
            par_ingre_list.appendChild(child_level1);

            //display input for ingredient amount
            div_id="ingre_amount_top"+j;
            child_level1=createHtmlElement('div',"col-md-2",div_id);
            child_level2=createHtmlElement('div',"contact_1ril");
            child_level3=createHtmlElement('div',"border_light");
            div_id=id+"ingre_amount_input"+j;
            //let pl_holder="1 tsp(melted)";
            let input=createSpecialHtmlElement('input',"form-control border-0",div_id,"","","1 tsp(melted)","20");
            child_level1.appendChild(child_level2).appendChild(child_level3).appendChild(input);

            //display error for ingredient amount input field
            child_level4=createHtmlElement('div',"");
            div_id=id+"ingre_field_error_msg"+j;
            //let err_field=createHtmlElement("p","col-md-2 col_green",div_id,"font-size: x-small;","");
            let err_field=createHtmlElement("p","col-md col_green",div_id,"font-size: x-small;","");
            child_level1.appendChild(child_level4).appendChild(err_field);
            par_ingre_list.appendChild(child_level1);

        }
      }

    } 
    }
  }
  checkIngredientAmounts();
}

//function to display full recipe
function displayFullRecipe()
{
  let par_recipe=document.getElementById("complete_recipe");
  //create line break
  //let space=createHtmlElement("div","row mb-3","space_before_recipe");
  //par_recipe.appendChild(space);
  for (let i in full_recipe) 
  {
    let element1=full_recipe[i];
    let id=getSectionTitleId(i+1);
    //console.log("object 1 inside recipe_detail: "+full_recipe[i]);
    for (let key in element1)
    {
      //console.log("key: "+key);
      let value = element1[key];
      if(key==='section_title')
      {  
        //display section title
        par_recipe=displaySectionTitleInRecipeDetail(par_recipe,id,value,false);//imported from display_recipe_functions.js

      }
      else if(key==='steps')
      {
        let j=0;
        for (let key2 in value)
        {
          //console.log("object 1: "+key2);
          if(value.hasOwnProperty(key2))
          {
            j++;
            let recipe = value[key2];
            let child_level1,child_level2;
            let recipe_step=j+". "+recipe.text;
            let div_id="step"+j;
            //display recipe step(OK)
            child_level1=createHtmlElement('div',"row",div_id);
            child_level2=createHtmlElement('div',"col-md-3");

            let recipe_field=createSpecialHtmlElement("b","","",recipe_step);
           
            child_level1.appendChild(child_level2).appendChild(recipe_field);
            par_recipe.appendChild(child_level1);

           }
         }
         //add space between section titles
         let space=createHtmlElement("div","row mb-3","space_between_recipe");
         par_recipe.appendChild(space);
      }
    }
  }
}
