import { MESSAGE_TYPES } from "./constants";
import LocalStorage from "./utils";
import Player from "./Player";
class Room {
  capacity = 4;
  isOpen = true;
  players = [];
  roomBox = "";
  game = "";
  storage = new LocalStorage();

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
    //! Esto se tiene que poner dentro del forEach línea 44 para actualizar
    //! la class Room a lo que tenga el localStorage de esta room
    // Creamos jugador que recoge los datos del usuario arrastrado
    const draggedPlayer = new Player(user.id, user.name, user.avatar);
    this.players.push(draggedPlayer);

    // Añadir jugador al LocalStorage rooms, en userRooms
    const currentRoomId = this.id;
    const rooms = this.storage.getLocalStorage("rooms");

    rooms.forEach((room) => {
      if (room.id === currentRoomId) {
        // Añadimos el usuario al array de userRooms de la sala que corresponde
        // siempre y cuando que no estuviese conectado
        const existUser = room.userRooms.find(
          (userRoom) => userRoom.id === user.id
        );
        !existUser && room.userRooms.push(user);

        // Modificamos contador jugadores caja
        const roomBoxDiv = document.getElementById(this.id);
        roomBoxDiv.querySelector(".m-room-drop-item__total span").innerHTML =
          room.userRooms.length;
      }
    });

    // Añadimos rooms actualizado al localStorage
    this.storage.setLocalStorage("rooms", rooms);

    if (this.players > 1) {
      // Mostrar posibilidad de empezar a jugar
    }
  }

  showRoomMessage(type, user) {
    let message;
    const messageDiv = document.querySelector("#roomMessage");
    switch (type) {
      case MESSAGE_TYPES.CONNECTED_TO_ROOM:
        message = `El usuario ${user.name} se ha conectado a esta sala`;
        break;
      default:
        return "";
    }

    const messageContentDiv = `<div class="alert alert-info alert-dismissible fade show" role="alert">
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                <span id="roomMessageContent">${message}</span>
              </div>`;
    messageDiv.innerHTML = messageContentDiv;
  }

  disableRoom(id) {
    const roomDivElement = document.getElementById(id);
    roomDivElement.classList.add("isFull");
  }

  getPlayers() {
    return players;
  }

  initStorageEvents() {
    window.addEventListener("storage", (e) => {
      // When local storage changes, dump the list to
      // the console.
      // console.log("e: ", e);
      // console.log(JSON.parse(window.localStorage.getItem("rooms")));
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
