const { putGame, addGame, delGame }    = require("../../services/users/games.js");
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
        const room = rooms.find((r) => r.roomId === roomId);
        let game = false;
        if(room && !room.isPlaying){
            game = await addGame({roomId, newGameInfo});
        }else if(room && room.isPlaying){
            game = await putGame({roomId, newGameInfo});
        }
        console.log('game', game);
        if(game){
          if(!room.isPlaying){
            rooms = rooms.map((r) => {
              return {isPlaying: (r.roomId === roomId) ? true : r.isPlaying, roomId: r.roomId}
            });
          }
          console.log('rooms', rooms);
          socket.to(roomId).emit("notifyUpdateGame", newGameInfo, roomId);
        }
      }catch(error){
        console.error(error);
      }
    });

    socket.on("removeGame", async ({ roomId }) => {
      try{
        const removed = await removeGame({roomId});

        if(removed){
          rooms = rooms.map((r) => {
            return {isPlaying: (r.roomId === roomId) ? false : r.isPlaying, roomId: r.roomId}
          });
          socket.to(roomId).emit("notifyUpdateGame", newGameInfo, roomId);
        }
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
          (r) => rooms.push(
            {roomId: r.id, isPlaying: false}
          )
        )
      }
    });
  });
};
module.exports = {
  loadSockets,
};
