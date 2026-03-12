
//this function organizes the valid alternative ingredient(s)
//alt_ingred_1/2/3: sanitized form of valid alternative ingredient in the order returned by the input fields(dynamicField1/2/3)
//return: the organized ingredient(s)
const organizeAltIngredients= function(alt_ingred_1,alt_ingred_2,alt_ingred_3){
	let json_list;
	if(alt_ingred_1==undefined)
    {
           if(alt_ingred_2==undefined)
           {
             if(alt_ingred_3==undefined)
             {
                //set json object to null since all fields are undefined
                const alt_ingred_list={alternative_ingredient_1: null};
                json_list=JSON.stringify(alt_ingred_list);

             }
             else{
                //only dynamicField3 has valid input
                const alt_ingred_list={alternative_ingredient_1: alt_ingred_3};
                json_list=JSON.stringify(alt_ingred_list);
             }

           }
           else
           {
             if(alt_ingred_3==undefined)
             {
                //only dynamicField2 has valid input
                const alt_ingred_list={alternative_ingredient_1: alt_ingred_2};
                json_list=JSON.stringify(alt_ingred_list);

             }
             else
             {
                //dynamicField2,dynamicField3 have valid inputs
                const alt_ingred_list={alternative_ingredient_1: alt_ingred_2,alternative_ingredient_2: alt_ingred_3};
                json_list=JSON.stringify(alt_ingred_list);
             }
           }
    }
    else{
           if(alt_ingred_2!=undefined)
           {
             if(alt_ingred_3!=undefined)
             {
               //all dynamicFIELDS have valid inputs
               const alt_ingred_list={alternative_ingredient_1: alt_ingred_1,alternative_ingredient_2: alt_ingred_2,alternative_ingredient_3: alt_ingred_3};
               json_list=JSON.stringify(alt_ingred_list);

             }
             else{
                //dynamicField2,dynamicField1 have valid inputs
                const alt_ingred_list={alternative_ingredient_1: alt_ingred_1,alternative_ingredient_2: alt_ingred_2};
                json_list=JSON.stringify(alt_ingred_list);
             }
           } 
           else
           {
            if(alt_ingred_3!=undefined)
            {
                //dynamicField1,dynamicField3 have valid inputs
                const alt_ingred_list={alternative_ingredient_1: alt_ingred_1,alternative_ingredient_2: alt_ingred_3};
                json_list=JSON.stringify(alt_ingred_list);
            }
            else{
                //only dynamicField1 has valid input
                const alt_ingred_list={alternative_ingredient_1: alt_ingred_1};
                json_list=JSON.stringify(alt_ingred_list);
            
            }

           }
    }
    return json_list;

}

//this function returns sanitized form of ingredient(if valid) else returns undefined
//res_field: field value returned as request
//value: sanitized field value
const getAltIngredient=function(res_field,value){
	if(res_field!=undefined)
    {
          return value;
          
    }
    return res_field;
}

module.exports={
    organizeAltIngredients,
    getAltIngredient
};