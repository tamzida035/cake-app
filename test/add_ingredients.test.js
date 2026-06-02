//runs all trst files in test folder: npm run test
const admin_controller = require("../controllers/adminController");
const request = require("supertest");// Using Supertest, we can test endpoints and routes on HTTP servers. (original code)
const appl = require("../app").app;//that is where our application starts.
//const db=require('../util/database');
require("dotenv").config();//to load environment variables

/* Connecting to the database before each test. */
/*beforeEach(async () => {
  const promise = db.promise();
});*/

describe('unit tests for adding ingredients: show errors for different fields if error occurs or show success message', () => {
  //main ingredient field error(empty input)
  it.only('should show error for empty main ingredient field ', async () => {
    // this code is 100% correct
     await request(appl)
      .post("/admin/add_ingredients")
      .send({ingred_field: "", options: "halal",}) // x-www-form-urlencoded upload
      .set('Accept', 'application/json')
      .expect(500,'["Main Ingredient field was empty"]');
    
  });
  //working code 1
  /*test('should throw an error if called without an arg', () => {
     return request(appl).post("/admin/add_ingredients").send({ingred_field: "", options: "halal"}).expect(200);//ok
   });*/
   //working code 2
   //const res = await request(appl).post("/admin/add_ingredients").send({ingred_field: "", options: "halal",});
  //expect(res.statusCode).toBe(500);//always shows true

  //main ingredient status error
  it.only('should show error for not selecting main ingredient status ', async () => {
    await request(appl)
      .post("/admin/add_ingredients")
      .send({ingred_field: "all-purpose flour",}) // x-www-form-urlencoded upload
      .set('Accept', 'application/json')
      .expect(500,'["main ingredients status was not selected"]');
  });
  //multiple field errors
  it.only('should show errors for all input fields', async () => {
    const expected_errors='["Main ingredient: ? did not meet input requirements and length was too short","main ingredients status was not selected","Alternative Ingredient 1: p did not meet input requirements and length was too short","Alternative Ingredient 2: field was empty","Alternative Ingredient 3: all -  purpose flour did not meet input requirements"]';
    await request(appl)
      .post("/admin/add_ingredients")
      .send({ingred_field: "?",dynamicField1:"p",dynamicField2:"",dynamicField3:"all -  purpose flour",}) // x-www-form-urlencoded upload
      .set('Accept', 'application/json')
      .expect(500,expected_errors);
  });
});
  /*test('should throw an error if called without an arg', () => {
     expect(() => { request(appl).post("/add_ingredients").send({
        ingred_field: "", options: "halal"})}).toThrow('Main Ingredient field was empty');
   });*/


describe('unit tests: data insertion to database ', () => {
  //note: this code runs successfully only the first time this file is run(npm run test). At subsequent times it throws error because then this ingredient
  //already exists in database. or delete this data from the database table for this code to run successfully each time
  it.only('should show success message after insertion of correctly formatted data', async () => {
    
      //const res = await request(appl).post("/add_ingredients").send({ingred_field: "riyyan", options: "halal",dynamicField1:"Whole-wheat flour",dynamicField2:"cornstarch",});
      await request(appl)
      .post("/admin/add_ingredients")
      .send({ingred_field: "All-purpose flour", options: "halal",dynamicField1:"Whole-wheat flour",dynamicField3:"cornstarch",}) // x-www-form-urlencoded upload
      .set('Accept', 'application/json')
      .expect(500,'"Ingredient has been successfully added to database."');
     
  });
  it.only('should show error message after attempt to insert an already existing ingredient in database ', async () => {
      await request(appl)
      .post("/admin/add_ingredients")
      .send({ingred_field: "All-purpose flour", options: "haram",}) // x-www-form-urlencoded upload
      .set('Accept', 'application/json')
      .expect(500,'"main ingredient already exists in database."');
     
  });
  //note: this code runs successfully only the first time this file is run(npm run test). At subsequent times it throws error because then this ingredient
  //already exists in database. or delete this data from the database table for this code to run successfully each time
  it.only('should show success message after insertion of data having trailing spaces in main ingredient field ', async () => {
    
      await request(appl)
      .post("/admin/add_ingredients")
      .send({ingred_field: "vanilla extract  ", options: "mushbooh",dynamicField1:"Alcohol free vanilla extract",dynamicField2:"vanilla powder",dynamicField3:"halal-certified vanilla extract",}) // x-www-form-urlencoded upload
      .set('Accept', 'application/json')
      .expect(500,'"Ingredient has been successfully added to database."');
     
  });
});
