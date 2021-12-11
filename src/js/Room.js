import { EVENT_TYPES, MESSAGE_TYPES } from "./constants";
import LocalStorage from "./utils";
import Game from "./Game";
class Room {
  capacity = 4;
  isOpen = true;
  players = [];
  roomBox = "";
  game = "";
  storage = new LocalStorage();
  playButtonDiv = document.getElementById("playButton");
  roomBox;
  currentAvatar;

  constructor(id, name, capacity, socket) {
    this.id = id;
    this.name = name;
    this.capacity = capacity;
    this.roomBox = document.querySelector(`#${id} .m-room-drop-item__image`);
    this.socket = socket;
  }

  initDragListeners() {
    this.roomBox.addEventListener("drop", this.onDropPlayer.bind(this));
    this.roomBox.addEventListener(
      "dragover",
      this.dragSobreContenedor.bind(this)
    );
    this.roomBox.addEventListener(
      "dragleave",
      this.dragSaleContenedor.bind(this)
    );
  }

  dragSaleContenedor(e) {
    e.preventDefault();
  }

  dragSobreContenedor(e) {
    e.preventDefault();
  }

  onDropPlayer(e) {
    const dragUSer = this.storage.getLocalStorage("me", "session");
    const avatarMobile = document.getElementById(
      e.dataTransfer.getData("userAvatar")
    );
    this.currentAvatar = avatarMobile;
    this.roomBox.innerHTML = this.currentAvatar.outerHTML;
    avatarMobile.parentNode.removeChild(avatarMobile);

    if (this.players.length === this.capacity) {
      this.isOpen = false;
      this.disableRoom(this.id);
      //console.log("sala llena!");
      return;
    }

    if (this.players.length > this.capacity || !this.isOpen) {
      //   console.log("La sala no acepta más jugadores");
      return;
    }

    this.addToRoom(dragUSer);
  }

  addToRoom(user) {
    const draggedPlayer = {
      name: user.name,
      avatar: user.avatar,
      id: user.id,
    };

    this.socket.emit("addUserToRoom", {
      roomId: this.id,
      newPlayer: draggedPlayer,
    });

    const gameTopPannelDiv = document.getElementById("gameTopPannel");
    gameTopPannelDiv.classList.remove("d-none");
    setTimeout(() => gameTopPannelDiv.classList.add("has-players"), 1000);
    gameTopPannelDiv.querySelector(
      ".m-game__title strong"
    ).innerHTML = `${this.name}`;
  }

  updatePlayers(usersRoom) {
    const roomBoxDiv = document.getElementById(this.id);
    roomBoxDiv.querySelector(".m-room-drop-item__total span").innerHTML =
      usersRoom.length;

    const listConnectedUSers = document.querySelector(
      "#roomConnectedMessage ul"
    );
    const connectedUsers = usersRoom.map((user) => `<li>${user.name}</li>`);
    listConnectedUSers.innerHTML = connectedUsers.join("");

    if (usersRoom.length > 1) {
      this.renderPlayBtn();
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

    // quitamos mensaje conectados del panel de juego
    document.getElementById("roomConnectedMessage").innerHTML = "";
  }

  takeOutFromRoom(player) {
    let is_in = this.players.find(
      (room_player) => room_player.id === player.id
    );
    handleEventPlayGamehandleEventPlayGame;
    if (!!is_in) {
      this.game.takeOutFromGame(player);
      //this.players = this.players.filter((room_player)=> room_player.id !== player.id);
    }
  }

  initSocketEvents() {
    this.socket.on("notifyNewUsertoRoom", (data, roomId) => {
      if (this.id === roomId) {
        this.updatePlayers(data);
      }
    });
    this.socket.on("notifyPlayGame", (data, roomId, userId) => {
      if (this.id === roomId) {
        console.log("hello");
        this.initGame(data);
      }
    });
  }

  // handleEventPlayGame(roomsList) {
  //   // Si la sala no es la que tiene el evento no hacemos nada
  //   if (roomsList.roomEventId !== this.id) return;
  //   const currentRoom = roomsList.rooms.find(
  //     (room) => room.id === roomsList.roomEventId
  //   );
  //   this.initGame(currentRoom.usersRoom, true);
  // }

  renderPlayBtn() {
    this.playButtonDiv.innerHTML = `<button class="btn btn-primary btn-lg btn-rounded px-4" type="button">Empezar a jugar!</button>`;
    this.playButtonDiv.addEventListener("click", this.playGame.bind(this));
  }

  playGame() {
    const user = this.storage.getLocalStorage("me", "session");
    this.socket.emit("playGame", { roomId: this.id, userId: user.id });
  }

  prepareGame() {
    // Quitamos botón de play
    this.playButtonDiv.innerHTML = "";

    // seteamos la room a close
    this.isOpen = false;

    // deshabilitamos sala
    this.disableRoom(this.id);
  }

  initGame(players, isCallWithEvent = false) {
    this.prepareGame(players);
    // Inicializamos juego
    const gridSize = 4;
    const currentPlayerInfo = this.storage.getLocalStorage("me", "session");
    this.game = new Game(
      this.id,
      currentPlayerInfo,
      players,
      this.socket,
      gridSize
    );
    this.game.init(isCallWithEvent);
  }
}

export default Room;
