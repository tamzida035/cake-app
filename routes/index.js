var express = require('express');
var router = express.Router();

/* GET home page. */ //(add error function)
//router.get('/', function(req, res) {
  //res.render('index', { title: 'Express' });
 // res.redirect("/home");
//});



// Require our controllers.
const home_controller = require("../controllers/homeController");

// GET catalog home page.
router.get("/", home_controller.index);
module.exports = router;