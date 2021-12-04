const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  id: String,
  name: String,
  email: String,
  password: String,
  avatar: String,
  favouriteRoom: String,
  color: String,
});

UserSchema.set("timestamps", true);

const User = mongoose.model("User", UserSchema);
module.exports = User;
