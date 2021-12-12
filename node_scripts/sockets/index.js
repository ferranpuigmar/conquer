const { addUserToRoom, getSingleRoom } = require("../../services/users/rooms.js");
const { createUSer, getUsers }         = require("../../services/users/users.js");
const { putGame, addGame, delGame }    = require("../../services/users/games.js");
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
          rooms.push({idRoom, isPlaying: false});

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
      const room = rooms.find((r) => r.roomId === roomId);
      let game = false;

      if(room && !room.isPlaying){
          game = await this.addGame({roomId, newGameInfo});
      }else if(room && room.isPlaying){
          game = await this.putGame({roomId, newGameInfo});
      }

      if(game){
        socket.to(roomId).emit("notifyUpdateGame", newGameInfo, roomId);
      }
    });


    socket.on("removeGame", async ({ roomId }) => {
      const removed = await this.removeGame({roomId});

      if(removed){
        const rooms = rooms.map((r) => { 
          return { roomId : r.roomId, isPlaying : ((r.roomId === roomId) ?  false : true) }
        });
        socket.to(roomId).emit("notifyUpdateGame", newGameInfo, roomId);
      }
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
