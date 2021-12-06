const { apiClient } = require("../../config/apiClient.js");

const getRooms = (data) => {
  return apiClient("/rooms").get();
};

const addUserToRoom = (data) => {
  return apiClient("/rooms/adduser", data).post();
};

module.exports = {
  getRooms,
  addUserToRoom
};
