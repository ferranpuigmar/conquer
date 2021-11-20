const express = require("express");
const router = express.Router();

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res, next) => {
  res.render("register");
});

router.get("/rooms", (req, res, next) => {
  res.render("rooms");
});

module.exports = router;
