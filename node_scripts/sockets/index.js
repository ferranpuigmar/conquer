const utils = require("../utils.js");
const usersFile = "users.json";

let rooms = [];

const loadSockets = (io) => {
  io.on("connection", (socket) => {
    socket.on("addUserToRoom", ({ roomId, newPlayer }) => {
      socket.join(roomId);

      const currentRoom = rooms.find((room) => room.id === roomId);
      const restUsers = currentRoom.usersRoom.filter(
        (userRoom) => userRoom.id !== newPlayer.id
      );

      if (currentRoom.usersRoom.length === 0) {
        currentRoom.usersRoom.push(newPlayer);
      } else {
        currentRoom.usersRoom = [...restUsers, newPlayer];
      }

      rooms = rooms.map((room) => {
        if (room.id === roomId) {
          room = currentRoom;
        }
        return room;
      });

      io.to(roomId).emit("notifyNewUsertoRoom", currentRoom.usersRoom, roomId);
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

    socket.on("generate_rooms_data", (rooms_data) => {
      if (rooms.length === 0) {
        rooms = rooms_data;
      }
    });
  });
};
module.exports = {
  loadSockets,
};
