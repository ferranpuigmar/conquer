const { putGame, delGame } = require("../../services/games.js");
const { addUserToRoom, getSingleRoom } = require("../../services/rooms.js");
const { getUsers } = require("../../services/users.js");

let rooms = [];

const loadSockets = (io) => {
  io.on("connection", (socket) => {
    socket.on("addUserToRoom", async ({ roomId, newPlayer }) => {
      try {
        let room = await getSingleRoom({roomId});
        let usersRoom = room.data.usersRoom;
        const existUserInRoom = usersRoom?.find(user => user.id === newPlayer.id);
        if(!existUserInRoom){
          const updateRoom = await addUserToRoom({ roomId, newPlayer });
          room = updateRoom;
          socket.join(roomId);
        }
        io.emit("notifyNewUsertoRoom", room.data.usersRoom, roomId);
        !room.data.isOpen && io.emit("disableRoom", roomId);
      } catch (error) {
        console.log('error: ', error)
        console.error(error);
      }
    });

    socket.on("playGame", async ({ roomId, userId }) => {
      try {
        const currentRoom = await getSingleRoom({ roomId });
        if (currentRoom) {
          io.to(roomId).emit(
            "notifyPlayGame",
            currentRoom.data.usersRoom,
            roomId,
            userId
          );
        }
      } catch (error) {
        console.error(error);
      }
    });

    socket.on("updateGame", async ({ roomId, newGameInfo }) => {
      try {
        await putGame({ roomId, newGameInfo });
        socket.to(roomId).emit("notifyUpdateGame", newGameInfo, roomId);
      } catch (error) {
        console.error(error);
      }
    });

    socket.on("removeGame", async ({ roomId }) => {
      try {
        const removed = await removeGame({ roomId });
        socket.to(roomId).emit("notifyUpdateGame", newGameInfo, roomId);
      } catch (error) {
        console.error(error);
      }
    });

    socket.on("load_db_users", async () => {
      const usersDB = await getUsers();
      io.to(socket.id).emit("get_db_users", usersDB);
    });

    socket.on("generate_rooms_data", async (rooms_data) => {
      if (rooms.length === 0) {
        rooms_data.forEach((r) => rooms.push(r));
      }
    });

    socket.on("updateUserSession", async ({roomId}) => {
      console.log("Hola");
      io.to(roomId).emit("notifyUserSession", {roomId});
    });
  });
};
module.exports = {
  loadSockets,
};
