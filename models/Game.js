const mongoose = require("mongoose");
const { Schema } = mongoose;

const playerSchema = {
  id: String,
  name: String,
  cellsConquered: Number,
  color: String,
  hasLost: Boolean,
};

const GameSchema = new Schema({
  id: Number,
  totalCellsToWin: Number,
});

GameSchema.set("timestamps", true);

const Game = mongoose.model("Game", GameSchema);
module.exports = Game;
