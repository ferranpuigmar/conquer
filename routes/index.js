const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("login");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res, next) => {
  res.render("register");
});

router.get("/rooms", function (req, res) {
  const data = {
    outside: false,
    boxRooms: [
      { id: "red-room-box" },
      { id: "blue-room-box" },
      { id: "green-room-box" },
      { id: "orange-room-box" },
    ],
  };
  res.render("rooms", data);
});

module.exports = router;
