const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const bcryptSalt = 10;
const status = require("http-status");
const { ErrorHandler } = require("../helpers/error");
const Room = require("../models/room");
const { MAX_BY_ROOM } = require("../contants/rooms");

// USER
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

router.put("/user/:id/updateRanking", async (req, res, next) => {
  const id = req.params.id;
  const data = req.body;
  console.log("id:", id);
  console.log("data:", data);
  try {
    await User.findOneAndUpdate(id, {
      $set: {
        rankingStatus: {
          cellsConquered: data.rankingStatus.cellsConquered,
          wins: data.rankingStatus.wins,
        },
      },
    });
    res.status(200).json({
      code: "ok",
      message: "Success",
    });
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

// AUTH
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
    if (userFromDb) {
      throw new ErrorHandler(status.CONFLICT, "El usuario existe");
    }
    const user = new User(userData);
    const saveUser = await user.save();
    if (saveUser) {
      res.status(200).send(saveUser);
    }
  } catch (error) {
    next(error);
  }
});

//ROOMS
router.get("/rooms", async (req, res, next) => {
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
    const isFullRoom = currentRoom.usersRoom.length === MAX_BY_ROOM;
    let currentUSers = currentRoom.usersRoom.length;

    if (!isFullRoom) {
      const find = { id: data.roomId };
      const update = { $push: { usersRoom: newPlayer } };
      await Room.updateOne(find, update);
      currentUSers++;

      res.status(200).json({
        code: "ok",
        message: "Success",
        data: {
          isOpen: currentUSers === MAX_BY_ROOM ? true : false,
        },
      });

      // Escoger si hacemos el emit aquí en caso que el último jugador haya llenado la sala,
      // o sea hace en sockets dentro de "addUserToRoom", donde captura la respuesta del res
    }

    if (currentRoom.usersRoom.length === MAX_BY_ROOM) {
      await Room.updateOne(find, { isOpen: false });
      throw new ErrorHandler(
        status.CONFLICT,
        "La habitación no està disponible"
      );
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

// RANKING
router.get("/ranking", async (req, res, next) => {
  try {
    const users = await User.find(
      {},
      { avatar: 1, id: 1, name: 1, rankingStatus: 1 }
    ).sort({
      "rankingStatus.wins": -1,
      "rankingStatus.cellsConquered": -1,
    });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

// GAME
router.post("/games/add", async (req, res, next) => {
  const data = req.body;
  try {
    const newGame = data.newGameInfo;
    const roomId = data.roomId;
    console.log(JSON.stringify(newGame, null, 4));
    console.log(JSON.stringify(roomId, null, 4));
    const game = new Game({ roomId: roomId, ...newGame });
    await game.save();
    res.status(200).send({
      code: "ok",
      message: "Success",
    });
  } catch (error) {
    next(error);
  }
});

router.put("/games/:id", async (req, res, next) => {
  const data = req.body;
  try {
    const roomId = data.roomId;

    Game.findByIdAndUpdate(
      roomId,
      {
        $set: { ...data.newGameInfo },
      },
      (err, updatedGame) => {
        if (err) {
          throw new ErrorHandler(
            status.CONFLICT,
            "Error al actualizar el tablero"
          );
        } else {
          res.status(200).send(updatedGame);
        }
      }
    );
  } catch (error) {
    next(error);
  }
});

router.delete("/games/:id", async (req, res, next) => {
  const data = req.body;
  try {
    const _id = data.roomId;
    Game.find({ id: _id }).remove().exec();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
