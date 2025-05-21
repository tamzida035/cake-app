//the "real" application entry point: sets up the application with various settings and middleware, 
var createError = require('http-errors');
var express = require('express');
var dotenv=require("dotenv").config();
var path = require('path');
var morgan=require("morgan");
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// These modules/files contain code for handling particular sets of related "routes" (URL paths)
// user home page logic script
var homeRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var d=app;

//middleware
app.use(morgan("dev"));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//dd the middleware libraries that we imported above into the request handling chain.
app.use(logger('dev'));
//express.json() and express.urlencoded() are needed to populate req.body with the form fields. 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//After these libraries we also use the express.static middleware, which makes Express serve all the static files in the /public directory in the project root.
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', homeRouter);
// define the Routes
/*app.get("/", (req, res) => {
  res.send("Put admin access link in this page");
});*/
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