const { apiClient } = require("../config/apiClient.js");

const createUser = (data) => {
  return apiClient("/user/register", data).post();
};

const loginInUser = (data) => {
  return apiClient("/user/login", data).post();
};

const updateRanking = (data) => {
  console.log(data);
  return apiClient(`/user/${data.id}/updateRanking`,data).put();
};

const getSingleUser = (data) => {
  return apiClient(`/user/${data.id}`).get();
};

const getUsers = () => {
  return apiClient("/users").get();
};



module.exports = {
  createUser,
  getUsers,
  getSingleUser,
  loginInUser,
  updateRanking
};
