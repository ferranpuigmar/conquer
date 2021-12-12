const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const bcryptSalt = 10;
const status = require("http-status");
const { ErrorHandler } = require("../helpers/error");
const Room = require("../models/room");

router.post("/user", async (req, res) => {
  try {
    const userData = req.body;
    // encriptamos password usuario para la BD
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(userData.password, salt);
    userData.password = hashPass;

    const user = new User(userData);
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

router.post("/user/login", async (req, res, next) => {
  const userData = req.body;
  const userFromDb = await User.findOne({ email: userData.email });

  try {
    if (!userFromDb) {
      throw new ErrorHandler(status.NOT_FOUND, "El usuario no existe");
    }

    if (bcrypt.compareSync(userData.password, userFromDb.password)) {
      res.status(200).send(userFromDb);
    } else {
      throw new ErrorHandler(status.BAD_REQUEST, "El password no es correcto");
    }
  } catch (error) {
    next(error);
  }
});


router.post("/user/login", async (req, res, next) => {
  const userData = req.body;
  const userFromDb = await User.findOne({ email: userData.email });

  try {
    if (!userFromDb) {
      throw new ErrorHandler(status.NOT_FOUND, "El usuario no existe");
    }

    if (bcrypt.compareSync(userData.password, userFromDb.password)) {
      res.status(200).send(userFromDb);
    } else {
      throw new ErrorHandler(status.BAD_REQUEST, "El password no es correcto");
    }
  } catch (error) {
    next(error);
  }
});


router.post("/user/register", async (req, res, next) => {
  const userData = req.body;
  // encriptamos password usuario para la BD
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(userData.password, salt);
  userData.password = hashPass;
  try {
    const userFromDb = await User.findOne({ email: userData.email });
    if (userFromDb) { throw new ErrorHandler(status.CONFLICT, "El usuario existe"); }
    const user = new User(userData);
    const saveUser = await user.save();
    if (saveUser) {
      res.status(200).send(saveUser);
    }
  } catch (error) {
    next(error);
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      throw new ErrorHandler(status.NOT_FOUND, "No existen usuarios");
    }
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

router.get("/rooms", async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    next(error);
  }
});

router.post("/rooms/adduser", async (req, res, next) => {
  const data = req.body;
  try {
    const newPlayer = data.newPlayer;
    const currentRoom = await Room.findOne({ id: data.roomId });

    if (currentRoom.usersRoom.length === 0) {
      currentRoom.usersRoom.push(newPlayer);
    } else {
      const restUsers = currentRoom.usersRoom.filter(
        (userRoom) => userRoom.id !== newPlayer.id
      );

      if(restUsers.length === currentRoom.usersRoom.length && !currentRoom.isOpen){
        throw new ErrorHandler(status.CONFLICT, "La habitación no està disponible");
      }

      currentRoom.usersRoom = [...restUsers, newPlayer];

      if(currentRoom.usersRoom.length === 4){
        currentRoom.isOpen === false;
      }
    }

    const saveRoom = await currentRoom.save();
    if (saveRoom) {
      res.status(200).send(saveRoom);
    }
  } catch (error) {
    next(error);
  }
});

router.get("/rooms/:id", async (req, res, next) => {
  try {
    const currentRoom = await Room.findOne({ id: req.params.id });
    console.log(currentRoom);
    if (currentRoom) {
      res.status(200).send(currentRoom);
    }
  } catch (error) {
    next(error);
  }
});

router.post("/games/add", async (req, res, next) => {
  const data = req.body;
  try {
    const newGame = data.newGameInfo;
    if (currentGame) {
      const game = new Game(newGame);
      const saveGame = await game.save();
      if (saveGame) {
        res.status(200).send(saveRoom);
      }
    }
  } catch (error) {
    next(error);
  }
});

router.put("/games/:id", async (req, res, next) => {
  const data = req.body;
  try {
    const newGame = data.newGameInfo;
    const _id     = data.roomId;

    Game.findByIdAndUpdate(
      _id,
      newGame,
      (err, updatedGame) => {
        if (err) {
          throw new ErrorHandler(status.CONFLICT, "Error al actualizar el tablero");
        } else {
          res.status(200).send(updatedGame);
        }
      }
    )
  } catch (error) {
    next(error);
  }
});

router.del("/games/:id", async (req, res, next) => {
  const data = req.body;
  try {
    const _id  = data.roomId;
    Game.find({ id: _id }).remove().exec();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
