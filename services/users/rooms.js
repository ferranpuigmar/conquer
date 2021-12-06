const { apiClient } = require("../../config/apiClient.js");

const getRooms = (data) => {
  return apiClient("/rooms").get();
};

const addUserToRoom = (data) => {
  return apiClient("/rooms/adduser", data).post();
};

const getSingleRoom = (roomId) => {
  return apiClient(`/rooms/${roomId}`).get();
};




module.exports = {
  getRooms,
  addUserToRoom,
  getSingleRoom
};
