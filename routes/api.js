//https://dev.to/mikefmeyer/build-a-node-js-express-rest-api-with-mongodb-and-swagger-3de9

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
/**
 * @swagger
 * /user:
 *   post:
 *     parameters:
 *      - in: body
 *        name: userData
 *        description: New user
 *        schema:
 *          type: object
 *          properties:
 *            password:
 *              type: string
 *     responses:
 *       200:
 *         description: Created
 */
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

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: The user ID.
 *     description: Get a user by id
 *     responses:
 *       200:
 *         description: Returns the requested user
 */

router.get("/user/:id", async (req, res, next) => {
  try {
    const user = await User.findOne({id: req.params.id});
    res.status(200).json({
      code: "ok",
      message: "Success",
      data: user
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /users:
 *   get:
 *     description: All users
 *     responses:
 *       200:
 *         description: Returns all the users
 */

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

/**
 * @swagger
 * /user/{id}/updateRanking:
 *   patch:
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: The user ID.
 *      - in: body
 *        name: user
 *        description: Update ranking
 *        schema:
 *          type: object
 *          properties:
 *            roomId:
 *              type: string
 *            rankingStatus:
 *              type: object
 *     responses:
 *       200:
 *         description: Ranking updated
 */
 router.put("/user/:id/updateRanking", async (req, res, next) => {
  const id = req.params.id;
  const data = req.body;

  try {
    await User.findOneAndUpdate({id: req.params.id}, {
      $set: {
        rankingStatus: data.rankingStatus,
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

// AUTH
/**
 * @swagger
 * /user/login:
 *   post:
 *     parameters:
 *      - in: body
 *        name: userData
 *        description: Login user
 *        schema:
 *          type: object
 *          properties:
 *            email:
 *              type: string
 *            password:
 *              type: string
 *     responses:
 *       200:
 *         description: Login success
 */
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

/**
 * @swagger
 * /user/register:
 *   post:
 *     parameters:
 *      - in: body
 *        name: userData
 *        description: Register new user
 *        schema:
 *          type: object
 *          properties:
 *            email:
 *              type: string
 *            password:
 *              type: string
 *     responses:
 *       200:
 *         description: Register success
 */
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

// RANKING
/**
 * @swagger
 * /ranking:
 *   get:
 *     description: All users ordened by puntuation
 *     responses:
 *       200:
 *         description: Returns all users ordened by puntuation
 */
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

//ROOMS
/**
 * @swagger
 * /rooms:
 *   get:
 *     description: All rooms
 *     responses:
 *       200:
 *         description: Returns all the rooms
 */
router.get("/rooms", async (req, res, next) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /user/register:
 *   post:
 *     parameters:
 *      - in: body
 *        name: data
 *        description: New user
 *        schema:
 *          type: object
 *          properties:
 *            email:
 *              type: string
 *            password:
 *              type: string
 *     responses:
 *       200:
 *         description: Register success
 */
router.post("/rooms/adduser", async (req, res, next) => {
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

/**
 * @swagger
 * /rooms/{id}:
 *   get:
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: The room ID.
 *     description: Get a room by id
 *     responses:
 *       200:
 *         description: Returns the requested room
 */

router.get("/rooms/:id", async (req, res, next) => {
  try {
    const currentRoom = await Room.findOne({ id: req.params.id });
    if (currentRoom) {
      res.status(200).send(currentRoom);
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /rooms/{id}/clearRoom:
 *   patch:
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: The user ID.
 *     responses:
 *       200:
 *         description: Clear the users of the room
 */
router.put("/rooms/:id/clearRoom", async (req, res, next) => {
  try {
    const find = { roomId: req.params.id };
    const update = { $set: { usersRoom: [] }};
    await Room.findOneAndUpdate(find, update);

    res.status(200).send({
      code: "ok",
      message: `La sala esta disponible`,
    });
  } catch (error) {
    next(error);
  }
});




// GAME
/**
 * @swagger
 * /games/create:
 *   post:
 *     parameters:
 *      - in: body
 *        name: userData
 *        description: Create new game
 *        schema:
 *          type: object
 *          properties:
 *            roomId:
 *              type: string
 *            game:
 *              type: object
 *                
 *     responses:
 *       200:
 *         description: New Game created
 */
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

/**
 * @swagger
 * /games/{id}/updateGame:
 *   patch:
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: The room ID.
 *      - in: body
 *        name: game
 *        description: Update game
 *        schema:
 *          type: object
 *          properties:
 *            roomId:
 *              type: string
 *            defeatedPlayers:
 *              type: object,
 *            grid:
 *              type: object,
 *            players:
 *               type: object,
 *            round:
 *              type: string
 *            totalCellsToWin: 
 *              type: number
 *     responses:
 *       200:
 *         description: Game updated
 */
router.put("/games/:id/updateGame", async (req, res, next) => {
  const data = req.body;

  try {
    await Game.findOneAndUpdate({roomId: req.params.id},
    {
      $set: {
        defeatedPlayers: data.defeatedPlayers,
        grid: data.grid,
        players: data.players,
        round: data.round,
        totalCellsToWin: data.totalCellsToWin,
      }
    });

    res.status(200).json({
      code: "ok",
      message: "Success",
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /games/{id}:
 *   delete:
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: The room ID.
 *     description: Delete a games by room id
 *     responses:
 *       200:
 *         description: Success
 */

router.delete("/games/:id", async (req, res, next) => {
  const data = req.body;
  try {
    await Game.deleteMany({ roomId: req.params.id });
    res.status(200).json({
      code: "ok",
      message: "Success",
    });
  } catch (error) {
    next(error);
  }
  
});

module.exports = router;
