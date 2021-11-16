const express = require("express");
const router = express.Router();

/* GET Login page. */
router.get("/", (req, res, next) => {
  res.render("login");
});

router.get("/register", (req, res, next) => {
  res.render("register");
});

router.get("/rooms", (req, res, next) => {
  res.render("rooms");
});

module.exports = router;
