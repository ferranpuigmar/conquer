const express = require("express");
const { getRooms } = require("../services/users/rooms");
const router = express.Router();

router.get("/", (req, res) => {
  const data = {
    outside: true,
  };
  
  res.render("login", data);

});

router.get("/login", (req, res) => {
  const data = {
    outside: true,
  };
  res.render("login", data);
});

router.get("/register", (req, res, next) => {
  const data = {
    outside: true,
  };
  res.render("register", data);
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
