const { apiClient } = require("../../config/apiClient.js");

const createUSer = (data) => {
  return apiClient("/user", data).post();
};

const loginInUser = (data) => {
  return apiClient("/user/login", data).post();
};

const getUsers = () => {
  return apiClient("/users").get();
};

module.exports = {
  createUSer,
  getUsers,
  loginInUser,
};
