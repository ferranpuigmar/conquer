const Room = require("../models/room");
const roomsBox = [{name: "alejandro", color: 'red'}, 
               {name: "atila", color: 'blue'},
               {name: "julio", color: 'green'},
               {name: "napoleon", color: 'orange'}];

const rooms = roomsBox.map((room) => ({
  id: `${room.name}-room`,
  name: room.name,
  color: room.color,
  usersRoom: [],
  isOpen: true,
}));

const createRooms = () => {
  rooms.forEach((room) => {
    const newRoom = new Room(room);
    return newRoom
      .save()
      .then((room) => {
        console.log(`${room.id} saved in DB`);
      })
      .catch((error) => {
        throw new Error(`Impossible to add room. ${error}`);
      });
  });
};

module.exports = {
  createRooms,
};
