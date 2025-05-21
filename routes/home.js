// abandoned file

const express = require("express");
const router = express.Router();

// Require our controllers.
const home_controller = require("../controllers/homeController");

// GET catalog home page.
router.get("/", home_controller.index);
