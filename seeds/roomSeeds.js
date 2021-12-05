const Room = require("../models/room");
const roomNames = ["alejandro", "atila", "julio", "napoleon"];

const rooms = roomNames.map((room) => ({
  id: `${room}-room`,
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
