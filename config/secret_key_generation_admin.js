// not needed in software project/Used only once to generate secret key for admin
// Including crypto module
const crypto = require('crypto');

// Calling randomBytes method without callback
const buf = crypto.randomBytes(20);

//convert bytes to String
const secret_key_admin=buf.toString('hex');

// Prints random bytes of generated data
console.log("The random bytes of data generated is: "+ secret_key_admin);

module.exports=secret_key_admin;