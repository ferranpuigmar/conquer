const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const bcryptSalt = 10;
const status = require("http-status");
const { ErrorHandler } = require("../helpers/error");
const Room = require("../models/room");
const { MAX_BY_ROOM } = require("../contants/rooms");
const Game = require("../models/Game");

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

router.get("/user/:id", async (req, res, next) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    res.status(200).json({
      code: "ok",
      message: "Success",
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

router.put("/user/:id/updateRanking", async (req, res, next) => {
  const id = req.params.id;
  const data = req.body;
  console.log(data.id, id);

  try {
    await User.findOneAndUpdate(
      { id: req.params.id },
      {
        $set: {
          rankingStatus: data.rankingStatus,
        },
      }
    );
    res.status(200).json({
      code: "ok",
      message: "Success",
    });
  } catch (error) {
    next(error);
  }

  // try {
  //   await User.findOneAndUpdate(id, {
  //     $set: {
  //       rankingStatus: {
  //         cellsConquered: data.rankingStatus.cellsConquered,
  //         wins: data.rankingStatus.wins,
  //       },
  //     },
  //   });
  //   res.status(200).json({
  //     code: "ok",
  //     message: "Success",
  //   });
  // } catch (error) {
  //   next(error);
  // }
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

router.post("/rooms/addUser", async (req, res, next) => {
  const data = req.body;
  try {
    const newPlayer = data.newPlayer;
    const currentRoom = await Room.findOne({ id: data.roomId });
    let users = currentRoom.usersRoom;
    const isFullRoom = currentRoom.usersRoom.length === MAX_BY_ROOM;
    let currentUsers = currentRoom.usersRoom.length;
    const find = { id: data.roomId };
    const update = { $push: { usersRoom: newPlayer } };

    if (!isFullRoom) {
      await Room.findOneAndUpdate(find, update);
      currentUsers++;
      users.push(newPlayer);

      res.status(200).send({
        code: "ok",
        message: "Success",
        data: {
          usersRoom: users,
          isOpen: currentUsers === MAX_BY_ROOM ? false : true,
        },
      });
    } else {
      await Room.findOneAndUpdate(find, { isOpen: false });
      throw new ErrorHandler(status.CONFLICT, "Room is closed");
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/rooms/deleteUser", async (req, res, next) => {
  const { roomId, playerId } = req.body;
  console.log("roomId: ", roomId);
  console.log("playerId: ", playerId);

  try {
    const find = { id: roomId };

    const currentRoom = await Room.find(find);
    let players = currentRoom.usersRoom;
    const deletedPlayer = players.find((player) => player.id === playerId);
    let newPlayers = players.filter((player) => player.id !== playerId);

    const update = { $set: { usersRoom: newPlayers } };
    await Room.findOneAndUpdate(find, update);

    res.status(200).send({
      code: "ok",
      message: `El jugador ${deletedPlayer.name} ha salido de la sala`,
      data: deletedPlayer,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/rooms/:id", async (req, res, next) => {
  try {
    const currentRoom = await Room.findOne({ id: req.params.id });
    if (currentRoom) {
      res.status(200).send({
        code: "ok",
        message: "Success",
        data: currentRoom,
      });
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
router.post("/games/create", async (req, res, next) => {
  const data = req.body;
  try {
    const newGame = data.initNewGameToStorage;
    const roomId = data.roomId;
    const game = new Game({ roomId, ...newGame });
    await game.save();
    res.status(200).send({
      code: "ok",
      message: "Success",
    });
  } catch (error) {
    next(error);
  }
});

router.put("/games/:id/updateGame", async (req, res, next) => {
  const data = req.body;

  try {
    await Game.findOneAndUpdate(
      { roomId: req.params.id },
      {
        $set: {
          defeatedPlayers: data.defeatedPlayers,
          grid: data.grid,
          players: data.players,
          round: data.round,
          totalCellsToWin: data.totalCellsToWin,
        },
      }
    );

    res.status(200).json({
      code: "ok",
      message: "Success",
    });
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
