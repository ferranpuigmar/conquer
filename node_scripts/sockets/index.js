const { addUserToRoom }         = require("../../services/users/rooms.js");
const { createUSer, getUsers }  = require("../../services/users/users.js");

let rooms = [];

const loadSockets = (io) => {
  io.on("connection", (socket) => {
    socket.on("addUserToRoom", ({ roomId, newPlayer }) => {
      const room = await addUserToRoom({ roomId, newPlayer });
      // END Lógica
      if(room){
        socket.join(roomId);
        io.to(roomId).emit("notifyNewUsertoRoom", currentRoom.usersRoom, roomId);
      }
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

    socket.on("load_db_users", async () => {
      const usersDB = await getUsers();
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
