const jwt = require("jsonwebtoken");
//importing dotenv package to share contents of .env file
let dotenv=require("dotenv").config();
const transporter = require('../../config/emailConfig');
// include pug module
const pug = require("pug");
const path = require('path');


//Generate email verification token
//email: user email address to verify
//userid: user id 
//username: user display name
//hashedPassword: bycrypted user password
const generateVerificationToken = (userid,username,email,hashedPassword) => {
  return jwt.sign({ id: userid, name:username,emailid: email,pwd:hashedPassword }, process.env.JWT_SECRET_KEY, {
    expiresIn: '1h',
  })
}

// function to construct a new email
//email: user email address to verify
//userid: user id 
//username: user display name
//emailToken: token generated for email verification link
const constructNewEmail=function(userid,username,email,emailToken){
  // token link
  const link ='https://localhost:443/new-user/'+userid+'/verify-email?token='+emailToken;
  const emailData = {name: username,verificationLink:link,};
  //__dirname: current directory
  const emailViewPath = path.join(__dirname, "../../views/site_visitor_views/email_verification.pug");
  // Compile a Pug template from a file to a function
  const compiledFunction = pug.compileFile(emailViewPath);
  // Render the function
  const emailHTML = compiledFunction(emailData);
  console.log("just before sending email");
  const mailDetails = {from: process.env.EMAIL_SENDER,to:email,subject: 'Verify Your Email Address',html:emailHTML,};
  return mailDetails;
  // Send verification email
  /*return new Promise((resolve, reject) => {
     transporter.sendMail(mailDetails,(error, info)=>{
        if (error) {
          reject(error);
        } else {
          //console.log("Info: "+info.response);
          resolve(emailToken);
  }});
   });*/

}
//function to verify new user email
//email: user email address to verify
//userid: user id 
//username: user display name
//hashedPassword: bycrypted user password
const sendEmailToNewUser= function(userid,username,email,hashedPassword){
    return new Promise((resolve, reject) => { 
    	// Generate verification token and send email
    	const emailToken = generateVerificationToken(userid,username,email,hashedPassword);
    	console.log("token: "+emailToken);
      console.log("token length: "+emailToken.length);
      console.log("userId: "+userid);
    	//const link ='https://localhost:443/new-user/'+userid+'/verify-email?token='+emailToken;

      let mailDetails=constructNewEmail(userid,username,email,emailToken);
      // Send verification email
      transporter.sendMail(mailDetails,(error, info)=>{
        if (error) {
          reject(error);
        } else {
          //console.log("Info: "+info.response);
        resolve(emailToken);
      }});


    	/*const emailData = {name: username,verificationLink:link,};
    	//__dirname: current directory
    	const emailViewPath = path.join(__dirname, "../../views/site_visitor_views/email_verification.pug");
    	// Compile a Pug template from a file to a function
      const compiledFunction = pug.compileFile(emailViewPath);
      // Render the function
      const emailHTML = compiledFunction(emailData);
      //console.log("just before sending email");
      const mailDetails = {from: process.env.EMAIL_USER,to:email,subject: 'Verify Your Email Address',html:emailHTML,};
        // Send verification email
        transporter.sendMail(mailDetails,(error, info)=>{
        if (error) {
        	reject(error);
      	} else {
      		//console.log("Info: "+info.response);
        	resolve(emailToken);
        }});*/
    });
};

/**
 * Verify a JWT token.
 * @param {string} token - JWT token to verify.
 * @returns {Promise<object>} - Resolves to the decoded user information if the token is valid or else throws error
 */
const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        //if(err.name==='TokenExpiredError')
          //return reject(err.message);// returns 'jwt expired'
        reject(err);
      } else {
        console.log("after decoded: "+decoded.id);
        resolve(decoded);
      }
    });
  });
};



//function to resend email to new user 
//email: user email address to verify
//userid: user id 
//username: user display name
//hashedPassword: bycrypted user password
//token: token generated for email verification link
const resendEmailToNewUser= function(userid,username,email,hashedPassword,token){
    return new Promise((resolve, reject) => { 
       let emailToken;
      // verify if previous token is still valid
      try {
        const decoded = verifyToken(token);
        emailToken=token;
      }
      catch (error) {
        if(error.message==='jwt expired'){
          // Generate verification token and send email
          emailToken = generateVerificationToken(userid,username,email,hashedPassword);

        }
        
      }
      //console.log("not called");
      let mailDetails=constructNewEmail(userid,username,email,emailToken);
      // Send verification email
      transporter.sendMail(mailDetails,(error, info)=>{
        if (error) {
          reject(error);
        } else {
          //console.log("Info: "+info.response);
        resolve(emailToken);
      }});
      //console.log(r);
      
      
      /*const link ='https://localhost:443/new-user/'+userid+'/verify-email?token='+emailToken;

      const emailData = {name: username,verificationLink:link,};
      //__dirname: current directory
      const emailViewPath = path.join(__dirname, "../../views/site_visitor_views/email_verification.pug");
      // Compile a Pug template from a file to a function
      const compiledFunction = pug.compileFile(emailViewPath);
      // Render the function
      const emailHTML = compiledFunction(emailData);
      //console.log("just before sending email");
      const mailDetails = {from: process.env.EMAIL_USER,to:email,subject: 'Verify Your Email Address',html:emailHTML,};
        // Send verification email
        transporter.sendMail(mailDetails,(error, info)=>{
        if (error) {
          reject(error);
        } else {
          //console.log("Info: "+info.response);
          resolve(emailToken);
        }});*/
    });
};
module.exports={
	sendEmailToNewUser,
	verifyToken,
  resendEmailToNewUser,
};