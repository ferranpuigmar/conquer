const { apiClient } = require("../config/apiClient.js");

const getRooms = () => {
  return apiClient("/rooms").get();
};

const addUserToRoom = (data) => {
  return apiClient("/rooms/adduser", data).post();
};

const getSingleRoom = (data) => {
  return apiClient(`/rooms/${data.roomId}`).get();
};

module.exports = {
  getRooms,
  addUserToRoom,
  getSingleRoom,
};
