const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
  const data = {
    outside: true,
  };
  res.render("login", data);
});

router.get("/login", function (req, res) {
  const data = {
    outside: true,
  };
  res.render("login", data);
});

router.get("/register", function (req, res) {
  const data = {
    outside: true,
  };
  res.render("register", data);
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
