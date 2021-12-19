const { apiClient } = require("../config/apiClient.js");

const getRooms = () => {
  return apiClient("/rooms").get();
};

const addUserToRoom = (data) => {
  return apiClient("/rooms/adduser", data).post();
};

const clearRoom = (data) => {
  return apiClient(`/rooms/${data.roomId}/clearRoom`,).del();
};

const getSingleRoom = (data) => {
  return apiClient(`/rooms/${data.roomId}`).get();
};

module.exports = {
  getRooms,
  addUserToRoom,
  clearRoom,
  getSingleRoom,
};
