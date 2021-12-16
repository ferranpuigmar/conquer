const { putGame, createGame, delGame }    = require("../../services/users/games.js");
const { addUserToRoom, getSingleRoom } = require("../../services/users/rooms.js");
const { createUSer, getUsers }         = require("../../services/users/users.js");

//{idRoom: id, isPlaying: true/false }
let rooms = [];

const loadSockets = (io) => {
  io.on("connection", (socket) => {
    socket.on("addUserToRoom", async ({ roomId, newPlayer }) => {
      try{
        const room = await addUserToRoom({ roomId, newPlayer });
        // END Lógica
        if(room){
          socket.join(roomId);
          io.to(roomId).emit("notifyNewUsertoRoom", room.usersRoom, roomId);
        }
      }catch(error){
        console.error(error);
      }
    });

    socket.on("playGame", async ({ roomId, userId }) => {
      try{
        const currentRoom = await getSingleRoom({ roomId });
        if(currentRoom){
          io.to(roomId).emit(
            "notifyPlayGame",
            currentRoom.usersRoom,
            roomId,
            userId
          );
        }
      }catch(error){
        console.error(error);
      }
    });

    socket.on("updateGame", async ({ roomId, newGameInfo }) => {
      try{
        await putGame({roomId, newGameInfo});
        socket.to(roomId).emit("notifyUpdateGame", newGameInfo, roomId);
      }catch(error){
        console.error(error);
      }
    });

    socket.on("removeGame", async ({ roomId }) => {
      try{
        const removed = await removeGame({roomId});
        socket.to(roomId).emit("notifyUpdateGame", newGameInfo, roomId);
      }catch(error){
        console.error(error);
      }
    });

    socket.on("load_db_users", async () => {
      const usersDB = await getUsers();
      io.to(socket.id).emit("get_db_users", usersDB);
    });

    socket.on("generate_rooms_data", (rooms_data) => {
      if (rooms.length === 0) {
        rooms_data.forEach(
          (r) => rooms.push(r)
        )
      }
    });
  });
};
module.exports = {
  loadSockets,
};
