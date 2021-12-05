const mongoose = require("mongoose");
const { Schema } = mongoose;

const RoomSchema = new Schema({
  id: String,
  usersRoom: [
    {
      name: String,
      avatar: String,
      id: String,
    },
  ],
  isOpen: Boolean,
});

RoomSchema.set("timestamps", true);

const Room = mongoose.model("Room", RoomSchema);
module.exports = Room;
