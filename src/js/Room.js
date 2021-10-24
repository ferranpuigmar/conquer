import { v4 as uuidv4 } from 'uuid';

class Room {
  capacity = 4;
  status = true;
  players = [];
  roomBox = "";

  constructor(id, name, capacity){
    this.name = name;
    this.capacity = capacity;
    this.roomBox = id;
  }

  addPlayer(player){
    this.players.push(player)
  }

  getPlayers(){
    return players;
  }
}

export default Room;