import mongoose from "mongoose";
const { Schema } = mongoose;

const GameSchema = new Schema({
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
