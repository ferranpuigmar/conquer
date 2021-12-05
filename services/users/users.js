const { apiClient } = require("../../config/apiClient.js");

const createUSer = (data) => {
  return apiClient("/user", data).post();
};

module.exports = {
  createUSer,
};
