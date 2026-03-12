const{
    isInputNonEmpty,
    isInputLengthValid,
    isInputValid
}=require("./commonValidators");

let MIN_INGREDIENT_INPUT_LENGTH=2;

//function to validate or sanitize ingredient fields
//value: ingredient name
//field_name: name of input field
//sanitized_ingred: sanitized form of ingredient
//return: sanitized_ingred or throw error if error occurs
const validateAndSanitizeIngredient= function(field_name,sanitized_ingred,value){
  //case 1: check that input field is non-empty
  let is_input_empty=isInputNonEmpty(value,field_name);
  //if input is non-empty
  let h;
  //console.log("original string: "+value);
  if(is_input_empty)
  {
    //split the input into separate words
    let splitted_words=value.split(/\s+/);

    for (let w=0; w<splitted_words.length;w++)
    {
      //console.log("word: "+splitted_words[w]);
      if(splitted_words[w]=='')
            continue;
      //check if word length is less than min value set for this field
      let f=isInputLengthValid(value,MIN_INGREDIENT_INPUT_LENGTH);
      //console.log("length valid: "+f+" "+splitted_words[w].length);
      //check non-empty input textfields for conforming to regular expression and adhere to minimum length constraint
      let condition = /^[a-zA-Z]+['|\-]?[a-zA-Z]{1,}$/;
      h=isInputValid(splitted_words[w],condition,field_name,f);
      if(h)
      {
        if(w==0) sanitized_ingred+=splitted_words[w];
        else sanitized_ingred+=(" "+splitted_words[w]);

      }

    }

   }
   return sanitized_ingred;

  //let splitted_words=value.split(/\s+/);

}

module.exports={
    validateAndSanitizeIngredient,
};