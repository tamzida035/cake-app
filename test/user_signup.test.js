//cmd to run a particular it from any test file: npm test -- -t 'should show error for all empty input fields' --verbose
//cmd to run a single test file: npm run test --testPathPattern=user_signup(does not work properly)
//const allUsers_controller = require("../controllers/allUsersController");
const request = require("supertest");// Using Supertest, we can test endpoints and routes on HTTP servers. (original code)
const appl = require("../app").app;//that is where our application starts.
//const db=require('../util/database');
require("dotenv").config();//to load environment variables

describe('unit tests for user sign-up: show errors for different fields if error occurs or show success message', () => {
  //TEST CASE 1
  it.only('should show error for all empty input fields', async () => {
    // this code is 100% correct
     await request(appl)
      .post("/user_sign_up")
      .send({name_field:"",email_field:"",password_field:"",confirm_password_field:""}) // x-www-form-urlencoded upload
      .set('Accept', 'application/json')
      .expect(500,'["Display name cannot be empty","Email Id cannot be empty","Password cannot be empty","Confirm password cannot be empty"]');
    
  });
  //TEST CASE 2
  it.only('should show invalid format errors for display name, password and confirm password fields', async () => {
    // this code is 100% correct
     await request(appl)
      .post("/user_sign_up")
      .send({name_field:"Rafa?",email_field:"rafa24@gmail.com",password_field:"r1234",confirm_password_field:"r1234"}) // x-www-form-urlencoded upload
      .set('Accept', 'application/json')
      .expect(500,'["Display name has invalid format and is too short","Password has invalid format and is too short","Password in password field is invalid"]');
    
  });
  //TEST CASE 3
  it.only('should show error for confirm password field and invalid email field', async () => {
    // this code is 100% correct
     await request(appl)
      .post("/user_sign_up")
      .send({name_field:"Rafa_39",email_field:"rafa24@gm?.com",password_field:"r1234B?_",confirm_password_field:"r1234"}) // x-www-form-urlencoded upload
      .set('Accept', 'application/json')
      .expect(500,'["Email Id has invalid format","Passwords do not match"]');
    
  });
  //TEST CASE 4
  it.only('should show error for existing display name field', async () => {
     await request(appl)
      .post("/user_sign_up")
      .send({name_field:"ruby_islam",email_field:"rubee_islam@yahoo.com",password_field:"go_rubeE-3",confirm_password_field:"go_rubeE-3"}) // x-www-form-urlencoded upload
      .set('Accept', 'application/json')
      .expect(500,'"this value is already in database"');
    
  });
  //TEST CASE 5
  it.only('should show error for existing email field', async () => {
     await request(appl)
      .post("/user_sign_up")
      .send({name_field:"ruby_4200",email_field:"rubee_islam@yahoo.com",password_field:"go_rubeE-3",confirm_password_field:"go_rubeE-3"}) // x-www-form-urlencoded upload
      .set('Accept', 'application/json')
      .expect(500,'"this value is already in database"');
    
  });
  //TEST CASE 6
  //should be executed only once
  it.only('should successfully insert user data into database table after sending email', async () => {
     await request(appl)
      .post("/user_sign_up")
      .send({name_field:"Riyyan89",email_field:"hafizriyyan2@gmail.com",password_field:"myCake@89app",confirm_password_field:"myCake@89app"}) // x-www-form-urlencoded upload
      .set('Accept', 'application/json')
      .expect(500,'"new user has been successfully added to database after sending email"');
    
  });
  //TEST CASE 7(DONT KNOW WHY NOT WORKING)
  //replace userid and token(tkn) given here by the ones assigned to your data, when you had previously signedup successfully using 'Riyyan89' data(data given in TEST CASE 6)
  //userid in my case: 62ebbac5-efb7-4c0c-81d0-ee3708cbd846
  //endpoint: /new-user/:userid+'/verify-email?token=:tkn'
  it.only('should give TokenExpiredError if user has clicked on received verification link after token expiary time(5 min)', async () => {
     await request(appl)
      .get("/new-user/a363c3db-08ea-4c86-9ac5-aca1fb6d4100/verify-email?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImEzNjNjM2RiLTA4ZWEtNGM4Ni05YWM1LWFjYTFmYjZkNDEwMCIsIm5hbWUiOiJSaXl5YW44OSIsImVtYWlsaWQiOiJoYWZpenJpeXlhbjJAZ21haWwuY29tIiwicHdkIjoiJDJiJDEwJG5mb21CNjR5S1NNa1BJRDZtZ3N0amVxSUp2blZxMW5UeW5JdHZYM2t2ekhmamZZdG1YT1ZTIiwiaWF0IjoxNzgxMjk2ODE5LCJleHAiOjE3ODEyOTcxMTl9.1lPmsBX0RBJCKK8eDGR4TD2TejDg9oh-6sCmf0--rfc")
      //.send({}) // x-www-form-urlencoded upload
      .set('Accept', 'application/json')
      //.expect("Content-Type", /json/)
      .expect(500,'"successful data update"');
    
  });
});