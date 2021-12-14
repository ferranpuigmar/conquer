const { apiClient } = require("../../config/apiClient.js");

const createUser = (data) => {
  return apiClient("/user/register", data).post();
};

const loginInUser = (data) => {
  return apiClient("/user/login", data).post();
};

const getUsers = () => {
  return apiClient("/users").get();
};

module.exports = {
  createUser,
  getUsers,
  loginInUser,
};
