//cmd to run a particular it from any test file: npm test -- -t 'should show error for all empty input fields' --verbose
//cmd to run a single test file: npm run test --testPathPattern=user_signup(does not work properly)
//const allUsers_controller = require("../controllers/allUsersController");
const request = require("supertest");// Using Supertest, we can test endpoints and routes on HTTP servers. (original code)
const appl = require("../app").app;//that is where our application starts.
//const db=require('../util/database');
require("dotenv").config();//to load environment variables

describe('unit tests for user login: show error if error occurs or show success message for successful login', () => {
	//TEST CASE 1
  it.only('should successfully login user to his account', async () => {
     await request(appl)
      .post("/user_login")
      .send({email_field:"hafizriyyan2@gmail.com",password_field:"myCake@89app"}) // x-www-form-urlencoded upload
      .set('Accept', 'application/json')
      .expect(500,'"successfully logged in"');
    
  });
  //TEST CASE 2
  it.only('should show error for non-existing user email', async () => {
     await request(appl)
      .post("/user_login")
      .send({email_field:"riy@gmail.com",password_field:"myCake@89app"}) // x-www-form-urlencoded upload
      .set('Accept', 'application/json')
      .expect(500,'"This email id does not exist"');
    
  });
  //TEST CASE 3
  it.only('should show error for incorrect password', async () => {
     await request(appl)
      .post("/user_login")
      .send({email_field:"hafizriyyan2@gmail.com",password_field:"myCakapp"}) // x-www-form-urlencoded upload
      .set('Accept', 'application/json')
      .expect(500,'"incorrect email/password"');
    
  });
});