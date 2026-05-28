// importing our database connection configuration
const db=require('../config/database');//original code

//function creates table in database using 'schema'
//cb: callback function
const createTable = (schema,cb) => {
    db.getConnection().then( conn => {
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
//value: value to be checked
//cb: callback function
//return: if is_resend_email is false, "this value is not in database" if value not found else return string "this value already is in database." else return the retrieved value
const checkRecordExists = (q,value,cb) => {
  //const q = `SELECT * FROM ${tableName} WHERE ${column} = ?`;
  db.getConnection().then( conn => {
         conn.query(q,[value])
         .then(r => {
                conn.release();
                console.log("selected value ");
                //console.log(JSON.stringify(r[0][0].email));
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
                console.log("selected value ");
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
                     console.log(r[0][0]);
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
//values: value to be updated and found respectively
//return: promise if update is successful else error
const updateRecord = (q,value,cb) => {
  //const q = `SELECT * FROM ${tableName} WHERE ${column} = ?`;
  db.getConnection().then( conn => {
         conn.query(q,[value])
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
  });
};

module.exports={
	checkRecordExists,
	insertRecord,
	createTable,
	checkAdminPasswordExists,
  getRecord,
  updateRecord,
};