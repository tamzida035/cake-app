// purpose: provides a wrapper to catch exceptions thrown in route handler functions.
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
 // res.send("NOT IMPLEMENTED: Home Page");
 if (req.session.data){
    if(req.session.data.role=='admin')// if admin has previously logged-in and the session had been saved
    {
       res.redirect("/admin/home");
    }
    else{

    }

 }
 else{
    res.render("index", {});

 }

 // res.render("index", {});
});