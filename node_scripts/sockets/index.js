const utils = require("../utils.js");
const usersFile = "users.json";

let rooms = [];

const loadSockets = (io) => {
  io.on("connection", (socket) => {
    socket.on("addUserToRoom", async ({ roomId, newPlayer }) => {
      console.log("ROOMID: ", roomId);
      socket.join(roomId);

      // const currentRoom = rooms.find((room) => room.id === roomId);
      // const restUsers = currentRoom.usersRoom.filter(
      //   (userRoom) => userRoom.id !== newPlayer.id
      // );

      // if (currentRoom.usersRoom.length === 0) {
      //   currentRoom.usersRoom.push(newPlayer);
      // } else {
      //   currentRoom.usersRoom = [...restUsers, newPlayer];
      // }

      // rooms = rooms.map((room) => {
      //   if (room.id === roomId) {
      //     room = currentRoom;
      //   }
      //   return room;
      // });

      /////////////////////////////////////////////////////
      let roomsFromDB = await utils.readFile(fileRooms);
      // console.log("roomsFromDB init: ", roomsFromDB);
      const currentRoomFDB = roomsFromDB.find((room) => room.id === roomId);
      const restUsersFDB = currentRoomFDB.usersRoom.filter(
        (userRoom) => userRoom.id !== newPlayer.id
      );
      console.log("restUsersFDB: ", restUsersFDB);
      if (currentRoomFDB.usersRoom.length === 0) {
        currentRoomFDB.usersRoom.push(newPlayer);
      } else {
        currentRoomFDB.usersRoom = [...restUsersFDB, newPlayer];
      }
      roomsFromDB = roomsFromDB.map((room) => {
        if (room.id === roomId) {
          return currentRoomFDB;
        }
        return room;
      });

      utils.writeFile(fileRooms, roomsFromDB, () =>
        io
          .to(roomId)
          .emit("notifyNewUsertoRoom", currentRoomFDB.usersRoom, roomId)
      );
    });

    socket.on("playGame", ({ roomId, userId }) => {
      const currentRoom = rooms.find((room) => room.id === roomId);

      io.to(roomId).emit(
        "notifyPlayGame",
        currentRoom.usersRoom,
        roomId,
        userId
      );
    });

    socket.on("updateGame", ({ roomId, newGameInfo }) => {
      rooms = rooms.map((room) => {
        if (room.id === this.roomId) {
          room.game = newGameInfo;
        }
        return room;
      });
      socket.to(roomId).emit("notifyUpdateGame", newGameInfo, roomId);
    });

    socket.on("register", (user) => {
      const usersDB = utils.readFile(usersFile) ?? [];
      console.log("usersDB: ", usersDB);

      const existUSer = usersDB.find((userDB) => userDB.email === user.email);

      if (existUSer) {
        io.to(socket.id).emit("register_exist_user");
        return;
      }
      usersDB.push(user);
      const data = JSON.stringify(usersDB, null, 4);
      utils.writeFile(usersFile, data, socket, io);
    });

    socket.on("load_db_users", async () => {
      const usersDB = (await utils.readFile(usersFile)) ?? [];
      io.to(socket.id).emit("get_db_users", usersDB);
    });

    socket.on("generate_rooms_data", async (rooms_data) => {
      let roomsArr = [];
      let gamesArr = [];

      if (rooms.length === 0) {
        rooms = rooms_data;
      }

      const roomsDB = await utils.readFile(fileRooms);
      const gamesDB = await utils.readFile(fileGames);

      console.log("roomsDB: ", roomsDB);
      console.log("gamesDB: ", gamesDB);

      if (
        !roomsDB ||
        !gamesDB ||
        (roomsDB?.length === 0 && gamesDB?.length === 0)
      ) {
        roomsArr = rooms_data.map((room) => {
          gamesArr.push({
            roomId: room.id,
            grid: [],
            players: [],
            defeatedPlaters: [],
            totalCellsToWin: 0,
            round: {
              turn: 0,
              roundNumber: 0,
              player: null,
            },
          });
          return {
            id: room.id,
            usersRoom: [],
            isOpen: true,
            usersRoom: [],
          };
        });
        const gameFile = "games.json";
        utils.writeFile(gameFile, gamesArr);

        const roomsFile = "rooms.json";
        utils.writeFile(roomsFile, roomsArr);
      }
    });
  });
};
module.exports = {
  loadSockets,
};
