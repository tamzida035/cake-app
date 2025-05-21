// purpose: provides a wrapper to catch exceptions thrown in route handler functions.
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Home Page");
  //res.render("index", {});
});