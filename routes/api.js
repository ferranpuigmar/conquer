const express = require("express");
const router = express.Router();

router.post("/user", (req, res) => {
  try {
    const { id, name, email, password, avatar, favouriteRoom, color } =
      req.body;

    console.log("NAME: ", name);
  } catch (error) {
    console.log(err);
  }
});

module.exports = router;
