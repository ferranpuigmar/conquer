import { MESSAGE_TYPES } from "./constants";
import Player from "./Player";
class Room {
  capacity = 4;
  isOpen = true;
  players = [];
  roomBox = "";
  game = "";

  constructor(id, name, capacity) {
    this.id = id;
    this.name = name;
    this.capacity = capacity;
  }

  onDraggPlayer(user) {
    if (this.players.length === this.capacity) {
      this.isOpen = false;
      disableRoom(this.id);
      console.log("sala llena!");
      return;
    }

    if (this.players.length > this.capacity || !this.isOpen) {
      console.log("La sala no acepta más jugadores");
      return;
    }

    this.addToRoom(user);
  }

  addToRoom(user) {
    // Creamos jugador que recoge los datos del usuario arrastrado
    const draggedPlayer = new Player(user.id, user.name, user.avatar);
    this.players.push(draggedPlayer);

    // Mostrar mensaje que se ha añadido un nuevo jugador
    this.showRoomMessage(MESSAGE_TYPES.CONNECTED_TO_ROOM, user);

    if (this.players > 1) {
      // Mostrar posibilidad de empezar a jugar
    }
  }

  showRoomMessage(type, user) {
    let message;
    const messageDiv = document.querySelector("#roomMessage h3");
    switch (type) {
      case MESSAGE_TYPES.CONNECTED_TO_ROOM:
        message = `El usuario ${user.name} se ha conectado a esta sala`;
        break;
      default:
        return "";
    }
    messageDiv.innerHTML = message;
  }

  disableRoom(id) {
    const roomDivElement = document.getElementById(id);
    roomDivElement.classList.add("isFull");
  }

  getPlayers() {
    return players;
  }

  takeOutFromRoom(player){
      let is_in = this.players.find((room_player)=> room_player.id === player.id);
      if(!!is_in){
        this.Game.takeOutFromGame(player);
        this.players = this.players.filter((room_player)=> room_player.id !== player.id);
      }
  }

  initStorageEvents() {
    window.addEventListener("storage", () => {
      // When local storage changes, dump the list to
      // the console.
      console.log(JSON.parse(window.localStorage.getItem("rooms")));
    });
  }

  initGame() {
    // Quitamos botón de play

    // Inicializamos juego
    const gridSize = 20;
    this.game = Game("grid", this.players, gridSize);
    this.game.init();
  }
}

export default Room;
