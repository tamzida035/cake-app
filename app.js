//this file is the "real" application entry point: sets up the application with various settings and middleware, 
var createError = require('http-errors');
var express = require('express');
//importing dotenv package to share contents of .env file
var dotenv=require("dotenv").config();
var path = require('path');
var morgan=require("morgan");
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session'); // express-sessions
const { v4: uuidv4 } = require('uuid'); // uuid, To call: uuidv4();
//const key=require("./util/secret_key_generation_admin");

// database connection
var connectDB=require("./util/database");
// middleware that parses user input and makes it available through the req.body property.
const bodyParser = require('body-parser'); 

// These modules/files contain code for handling particular sets of related "routes" (URL paths)
// user home page logic script
var homeRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');

var app = express();
var d=app;

//middleware
app.use(morgan("dev"));
// Configure Sessions Middleware
//The secret key signs the cookie that stores the session ID. It should be a random string that is difficult for a hacker to guess.
// I used crypto.randomBytes(20).toString('hex') to generate a string. The secret should be constant. If it changes, existing sessions become invalid.
// It is saved in  .env file
const secret_key=process.env.SECRET_KEY;
const session_name=process.env.SESSIONCOOKIENAME;
//console.log('secret key '+ secret_key);
//app.use(cookieParser('LKp:OM2C;uO;BIE{`c*^Qg(n'bLY)7'');
app.use(session({genid: function (req) {
    //This option creates a session ID by using a function of req.We are using the UUID library to call the function uuidv4() and set a random ID.
    return uuidv4();
  },
  name: session_name,
  secret: secret_key,
  //If true, whether or not the data has changed, the session data is forcibly saved. 
  //Most of the time, you want this set to false to reduce calls to your database.
  resave: false,
  //If true, new uninitialized sessions get forcibly saved.
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000*2 } //2 hour (for production,change it to 2)
  }));

//setup database connection
//connectDB();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//dd the middleware libraries that we imported above into the request handling chain.
app.use(logger('dev'));
//express.json() and express.urlencoded() are needed to populate req.body with the form fields. 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//When working with forms, we use the urlencoded parser because by default, forms send data in URL encoded format.
app.use(bodyParser.urlencoded({ extended: false }));// set to false, means it uses the QueryString library to parse URL encoded data

//After these libraries we also use the express.static middleware, which makes Express serve all the static files in the /public directory in the project root.
app.use(express.static(path.join(__dirname, 'public')));


// define the Routes
/*app.get("/", (req, res) => {
  res.send("Put admin access link in this page");
});*/
app.use('/', homeRouter);
app.use('/admin', adminRouter);

app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//module.exports = app;
module.exports = {
    app,
    path
};