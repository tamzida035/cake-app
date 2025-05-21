var express = require('express');
var router = express.Router();

/* GET home page. */ //(add error function)
//router.get('/', function(req, res) {
  //res.render('index', { title: 'Express' });
 // res.redirect("/home");
//});



// Require home controllers
const home_controller = require("../controllers/homeController");

// home page
router.get("/", home_controller.index);//--->Important : update architecture diagam about this route (homepage), controller(homeController)
module.exports = router;