const express = require("express");
const { getRooms } = require("../services/users/rooms");
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

router.get("/rooms", async function (req, res) {
  const rooms = await getRooms();
  const data = {
    outside: false,
    boxRooms: rooms.map((room) => ({ id: room.id })),
  };
  console.log("data: ", data);
  res.render("rooms", data);
});

module.exports = router;
