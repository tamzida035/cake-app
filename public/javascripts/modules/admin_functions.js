

var MIN_INGREDIENT_INPUT_LENGTH=2;
//check if character 'code' is alphabet
//returns true if so (NOT YET NEEDED)
function isAlphabet(code){ 
 
 return ((code >= 65 && code <= 90) || (code >= 97 && code <= 122));
}

//checks if apostrophe is present in the given input and if present, it is between 2 alphabets
//returns: true, if no apostrophe is present or if apostrophe present are located between 2 alphabets (NOT YET NEEDED)
function invalidApostrophe(text)
{
  var len=text.length;
  //
  for (var x=0;x<len;x++)
  {
    var code = text.charCodeAt(x);
    if(code==39)
    { 
      if(x-1>=0)
      {
        var prev_code = text.charCodeAt(x-1);
        if(!isAlphabet(prev_code))
        {
          return false;
        }
      }
      else{
        return false;
      }
      if(x+1<len)
      {
        var next_code = text.charCodeAt(x+1);
        if(!isAlphabet(next_code))
        {
          return false;
        }

      }
      else{
        return false;
      }

    }

  }
  return true;

}

module.exports={
	invalidApostrophe,
	MIN_INGREDIENT_INPUT_LENGTH,
	//insertHashedPassword,
	//deletePassword,
};
