// importing our database connection configuration
const db=require('../config/database');//original code
let util = require('util');
//function creates table in database using 'schema'
//cb: callback function
const createTable = (schema,cb) => {
  //way 1
    /*db.getConnection().then( conn => {
         conn.execute(schema)
         .then(r => {
                conn.release();
                //console.log("is table exists"+r[0][0]);
                if(cb)
                {
		         cb("table exists");
		        }
            })
         .catch(err => {
                conn.release();
                //conn.release();
                //console.log(err.code);
                if(cb){
		    cb(err.code);
		  }
			
            });
 	});*/
  db.query(schema)
   //db.execute(q,[values])
   .then(r => {
                console.log("r value "+JSON.stringify(r[0]));
                //console.log("r[0]1: "+JSON.stringify(r[0]));
                //console.log("r[0][0]1: "+JSON.stringify(r[0][0]));

                if(r[0]==undefined)
                {

                  if(cb)
                  {
                     cb("table does not exist");
                  }

                }
                else{
                  if(cb)
                  {
                     console.log("r value in check "+JSON.stringify(r));
                     cb("table exists");
                  }
                }
                
                /*if(cb)
                {
                     cb("successful data update");
                }*/
                
    })
    .catch(err => {
                console.log('Error fetching record from the database: ' + err.stack);
                if(cb){
                 //cb(err.code);
                 //console.log("q: "+q+" "+typeof(q));
                 //console.log("values: "+JSON.stringify(values)+" "+typeof(values));
                 cb(err);
                }
      
    });

};
//function checks if even admin password exists in db
//q: query
//cb: callback function
const checkAdminPasswordExists = (q,cb) => {
  //const q = `SELECT * FROM ${tableName} WHERE ${column} = ?`;
  db.getConnection().then( conn => {
         conn.query(q)
         .then(r => {
                conn.release();
                console.log("send: "+r);
                if(cb)
                {
			cb(r);
		  }
            })
         .catch(err => {
                conn.release();
                console.log('Error fetching password from the database: ' + err.stack);
                if(cb){
		      cb(err);
	         }
			
            });
 	});
};

//function performs query 'q' to look for 'value' in database table
//q: query
//value: values to be checked
//cb: callback function
//return: if is_resend_email is false, "this value is not in database" if value not found else return string "this value already is in database." else return the retrieved value
const checkRecordExists = (q,values,cb) => {
  //const q = `SELECT * FROM ${tableName} WHERE ${column} = ?`;
  console.log(values+" in checkRecordExists");
  //wy 1
  /*db.getConnection().then( conn => {
         conn.query(q,[value])
         .then(r => {
                conn.release();
                //console.log("selected value ");
                console.log("r: "+JSON.stringify(r));
                console.log("r[0]1: "+JSON.stringify(r[0]));
                console.log("r[0][0]1: "+JSON.stringify(r[0][0]));
                //let obj=JSON.parse(r[0][0]);
                if(r[0][0]==undefined)
                {

                  if(cb)
                  {
			               cb("this value is not in database");
		              }

                }
                else{
                  if(cb)
                  {
                     console.log("r value in check "+JSON.stringify(r[0][0]));
			               cb("this value is already in database");
		              }
                }
            })
         .catch(err => {
                conn.release();
                console.log('Error fetching record from the database: ' + err.stack);
                if(cb){
		             //cb(err.code);
                  cb(err);
	              }
			
            });
 	});*/
  //way 2
  db.execute(q,values)
   //db.execute(q,[values])
   .then(r => {
                console.log("r value "+JSON.stringify(r[0]));
                console.log("r[0]1: "+JSON.stringify(r[0]));
                console.log("r[0][0]1: "+JSON.stringify(r[0][0]));

                if(r[0][0]==undefined)
                {

                  if(cb)
                  {
                     cb("this value is not in database");
                  }

                }
                else{
                  if(cb)
                  {
                     console.log("r value in check "+JSON.stringify(r[0][0]));
                     cb("this value is already in database");
                  }
                }
                
                /*if(cb)
                {
                     cb("successful data update");
                }*/
                
    })
    .catch(err => {
                console.log('Error fetching record from the database: ' + err.stack);
                if(cb){
                 //cb(err.code);
                 console.log("q: "+q+" "+typeof(q));
                 //console.log("values: "+JSON.stringify(values)+" "+typeof(values));
                 cb(err);
                }
      
    });
};

const checkRecordExists2 = (q,values,cb) => {
  //const q = `SELECT * FROM ${tableName} WHERE ${column} = ?`;
  console.log(values+" in checkRecordExists 2");
  //wy 1
  /*db.getConnection().then( conn => {
         conn.query(q,[value])
         .then(r => {
                conn.release();
                //console.log("selected value ");
                console.log("r: "+JSON.stringify(r));
                console.log("r[0]1: "+JSON.stringify(r[0]));
                console.log("r[0][0]1: "+JSON.stringify(r[0][0]));
                //let obj=JSON.parse(r[0][0]);
                if(r[0][0]==undefined)
                {

                  if(cb)
                  {
                     cb("this value is not in database");
                  }

                }
                else{
                  if(cb)
                  {
                     console.log("r value in check "+JSON.stringify(r[0][0]));
                     cb("this value is already in database");
                  }
                }
            })
         .catch(err => {
                conn.release();
                console.log('Error fetching record from the database: ' + err.stack);
                if(cb){
                 //cb(err.code);
                  cb(err);
                }
      
            });
  });*/
  //way 2
  db.execute(q,[values])
   //db.execute(q,[values])
   .then(r => {
                console.log("r value "+JSON.stringify(r[0]));
                console.log("r[0]1: "+JSON.stringify(r[0]));
                console.log("r[0][0]1: "+JSON.stringify(r[0][0]));

                if(r[0][0]==undefined)
                {

                  if(cb)
                  {
                     cb("this value is not in database");
                  }

                }
                else{
                  if(cb)
                  {
                     console.log("r value in check "+JSON.stringify(r[0][0]));

                     cb("this value is already in database");
                  }
                }
                
                /*if(cb)
                {
                     cb("successful data update");
                }*/
                
    })
    .catch(err => {
                console.log('Error fetching record from the database: ' + err.stack);
                if(cb){
                 //cb(err.code);
                 console.log("q: "+q+" "+typeof(q));
                 //console.log(util.inspect(values));
                 //console.log("values: "+JSON.stringify(values)+" "+typeof(values));
                 cb(err);
                }
      
    });
};

//function performs 'query' to insert 'record' in database table
//cb: callback function
//return: string "successful data insertion" if record is successfully inserted else return error code
const insertRecord = (query, record,cb) => {
	//const query = `INSERT INTO ${tableName} SET ?`;
	db.getConnection().then( conn => {
         conn.execute(query,record)
         .then(r => {
                conn.release();
                //console.log(r[0]);
                if(cb)
                {
		    cb("successful data insertion");
		  }
            })
         .catch(err => {
                conn.release();
                //conn.release();
                //console.log(err.code);
                if(cb){
		    cb(err.code);
		  }
			
            });
 	});
};


//function to get a record from the database
//cb: callback function
//value: value to be checked
//return: "this value is not in database" if value not found  else return the retrieved value
const getRecord = (q,value,cb) => {
  //const q = `SELECT * FROM ${tableName} WHERE ${column} = ?`;
  db.getConnection().then( conn => {
         conn.query(q,[value])
         .then(r => {
                conn.release();
                //console.log("selected value ");
                //console.log(JSON.stringify(r[0][0].email));// works correctly
                //let obj=JSON.parse(r[0][0]);
                if(r[0][0]==undefined)
                {

                  if(cb)
                  {
                     cb("this value is not in database");
                  }

                }
                else{
                  if(cb)
                  {
                     //console.log(r[0][0]);
                     console.log("r value "+JSON.stringify(r[0][0]));
                     cb(r[0][0]);
                  }
                }
            })
         .catch(err => {
                conn.release();
                console.log('Error fetching record from the database: ' + err.stack);
                if(cb){
                 //cb(err.code);
                  cb(err);
                }
      
            });
  });
};

//function to update a record from the database
//cb:callback function
//values: values to be updated and found respectively
//return: promise if update is successful else error
const updateRecord = (q,values,cb) => {
  //original code(works, sometimes gives errors) 
  /*db.getConnection().then( conn => {
         conn.query(q,[values])
         .then(r => {
                conn.release();
                console.log("r value "+JSON.stringify(r[0]));
                //console.log("selected value");
                if(cb)
                {
                     cb("successful data update");
                }
                
            })
         .catch(err => {
                conn.release();
                console.log('Error fetching record from the database: ' + err.stack);
                if(cb){
                 //cb(err.code);
                  cb(err);
                }
      
            });
  });*/
  //way 2(works)
  db.execute(q,values)
   //db.execute(q,[values])
   .then(r => {
                console.log("r value "+JSON.stringify(r[0]));
                
                if(cb)
                {
                     cb("successful data update");
                }
                
    })
    .catch(err => {
                console.log('Error fetching record from the database: ' + err.stack);
                if(cb){
                 //cb(err.code);
                  cb(err);
                }
      
    });
};

//function to update a new user record from the database (NO MORE NEEDED)
//cb:callback function
//email: user email address to be verified
//token: token generated for email verification link
//return: promise if update is successful else error
const updateRecord2 = (q,token,email,cb) => {
  //original code (works)
  /*db.getConnection().then( conn => {
         //conn.query(q,[values])
         conn.execute(q,[token,email])
         .then(r => {
                conn.release();
                console.log("selected value ");
                if(cb)
                {
                     cb("successful data update");
                }
                
            })
         .catch(err => {
                conn.release();
                console.log('Error fetching record from the database: ' + err.stack);
                if(cb){
                 //cb(err.code);
                  cb(err);
                }
      
            });
  });*/
  //wy 2(works)
   db.execute(q,[token, email])
   .then(r => {
                
                console.log("selected value ");
                if(cb)
                {
                     cb("successful data update");
                }
                
    })
    .catch(err => {
                //conn.release();
                console.log('Error fetching record from the database: ' + err.stack);
                if(cb){
                 //cb(err.code);
                  cb(err);
                }
      
    });
};

module.exports={
	checkRecordExists,
	insertRecord,
	createTable,
	checkAdminPasswordExists,
  getRecord,
  updateRecord,
  checkRecordExists2,
  updateRecord2,
};