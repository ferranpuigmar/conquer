
import { EVENT_TYPES, MESSAGE_TYPES } from "./constants";
let players = [];

const io = require("socket.io")(server);

const mysockets = () =>{
    io.on("connection", (socket) => {
        console.log("User connected: " + socket.id);
      
        socket.on("game", (data) => {
          socket.emit("game", data);
        });
      
        socket.on("room", (data) => {
          socket.to(data.roomID).emit("room", data);
        });
      });
}

export default mysockets;


