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
    expiresIn: '5m',// 1d
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
  //console.log("link: "+link);
  const emailData = {name: username,verificationLink:link,};
  //__dirname: current directory
  const emailViewPath = path.join(__dirname, "../../views/site_visitor_views/email_verification.pug");
  // Compile a Pug template from a file to a function
  const compiledFunction = pug.compileFile(emailViewPath);
  // Render the function
  const emailHTML = compiledFunction(emailData);
  //console.log("just before sending email");
  const mailDetails = {from: process.env.EMAIL_SENDER,to:email,subject: 'Verify Your Email Address',html:emailHTML,};
  return mailDetails;

}
//function to verify new user email
//email: user email address to verify
//userid: user id 
//username: user display name
//hashedPassword: bycrypted user password
//IsPrevTokenInvalid: true, if previous token is non-existent or become invalid
//prev_token: null (if no prev token exists) or send previous token
const sendEmailToNewUser= function(userid,username,email,hashedPassword,prev_token,IsPrevTokenInvalid){
    return new Promise((resolve, reject) => { 
    	// Generate verification token and send email
    	let emailToken;
      //generate new token if prev token does not exist or has expired
      if(IsPrevTokenInvalid)
      {
        emailToken = generateVerificationToken(userid,username,email,hashedPassword);
        console.log("newly generted token for resend: "+emailToken);
      } 
      else emailToken=prev_token;
    	/*console.log("token: "+emailToken);
      console.log("token length: "+emailToken.length);
      console.log("userId: "+userid);*/
    	//const link ='https://localhost:443/new-user/'+userid+'/verify-email?token='+emailToken;

      let mailDetails=constructNewEmail(userid,username,email,emailToken);
      // Send verification email
      transporter.sendMail(mailDetails,(error, info)=>{
        if (error) {
          reject(error);
        } 
        else{
        //console.log("Info: "+info.response);
        //console.log("Info: "+info);
        resolve(emailToken);
      }});
    });
}

/**
 * Verify a JWT token.
 * @param {string} token - JWT token to verify.
 * @returns {Promise<object>} - Resolves to the decoded user information if the token is valid or else throws error
 */
const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {//err.name === 'JsonWebTokenError' or err.name==='TokenExpiredError'
        console.log("err: "+err);
        reject(err);
        //reject(err);
          //return reject(err.message);// returns 'jwt expired'
      } else {
        console.log("after decoded: "+decoded.id);
        resolve(decoded);
      }
    });
  });
};



module.exports={
	sendEmailToNewUser,
	verifyToken,
};