const { apiClient } = require("../../config/apiClient.js");


const addGame = (data) => {
    return apiClient("/games/add", data).post();
};

const putGame = (data) => {
    return apiClient(`/games/${data.roomId}`,data).put();
};

const delGame = (data) => {
    return apiClient(`/games/${data.roomId}`).del();
};


module.exports = {
    addGame,
    putGame,
    delGame
};