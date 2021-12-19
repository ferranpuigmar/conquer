const { apiClient } = require("../config/apiClient.js");

const getRooms = () => {
  return apiClient("/rooms").get();
};

const addUserToRoom = (data) => {
  return apiClient("/rooms/addUser", data).post();
};

const delUserFromRoom = (data) => {
  return apiClient(`/rooms/deleteUser/${data.playerId}`).del();
};

const getSingleRoom = (data) => {
  return apiClient(`/rooms/${data.roomId}`).get();
};

module.exports = {
  getRooms,
  addUserToRoom,
  getSingleRoom,
  delUserFromRoom,
};
