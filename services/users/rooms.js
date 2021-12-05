const { apiClient } = require("../../config/apiClient.js");

const getRooms = (data) => {
  return apiClient("/rooms").get();
};

module.exports = {
  getRooms,
};
