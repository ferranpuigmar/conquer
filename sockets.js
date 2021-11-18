
import { EVENT_TYPES, MESSAGE_TYPES } from "./constants";
let players = [];

const io = require("socket.io")(server);

const mysockets = () =>{
    io.on("connection", (socket) => {
        console.log("User connected: " + socket.id);
      
        socket.on("game", (data) => {
          switch (data.eventType) {
            case EVENT_TYPES.ADD_USER_TO_ROOM:
                break;
            default:
               socket.emit("game", data);
          }
        });
      
        socket.on("room", (data) => {
          socket.emit("room", data);
        });
      });
}

export default mysockets;


