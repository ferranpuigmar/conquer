import { MESSAGE_TYPES } from "./constants";
import LocalStorage from "./utils";
import Game from "./Game";
import { delUserFromRoom } from "../../services/rooms";
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
    const dragUser = this.storage.getLocalStorage("me", "session");
    const avatarMobile = document.getElementById(
      e.dataTransfer.getData("userAvatar")
    );
    this.currentAvatar = avatarMobile;
    this.roomBox.innerHTML = this.currentAvatar.outerHTML;
    avatarMobile.parentNode.removeChild(avatarMobile);

    if (this.players.length === this.capacity) {
      this.isOpen = false;
      this.disableRoom(this.id);
      return;
    }

    this.addToRoom(dragUser);
  }

  addToRoom(user) {
    const draggedPlayer = {
      name: user.name,
      avatar: user.avatar,
      rankingStatus: user.rankingStatus,
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
    let me = this.storage.getLocalStorage("me", "session");
    const existUserInRoom = usersRoom.find((user) => user.id === me.id);
    const bubbles = usersRoom.map((user) => {
      return this.generateBubble(user, usersRoom.length);
    });
    this.roomBox.innerHTML = bubbles.join("");
    const roomBoxDiv = document.getElementById(this.id);
    roomBoxDiv.querySelector("#roomTotalPlayers").innerHTML = usersRoom.length;

    if (existUserInRoom) {
      this.players = usersRoom;
      const listConnectedUSers = document.querySelector(
        "#roomConnectedMessage ul"
      );
      const connectedUsers = usersRoom.map((user) => `<li>${user.name}</li>`);
      listConnectedUSers.innerHTML = connectedUsers.join("");
      usersRoom.length > 1 && this.renderPlayBtn();
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

  async logOut(player) {
    // borramos de rooms de la BD
    try {
      await delUserFromRoom({ roomId: this.id, playerId: player.id });
    } catch (error) {
      console.log(error);
    }
    // Si hay un juego en curso
    if (this.game !== "") {
    }
  }

  initSocketEvents() {
    this.socket.on("notifyNewUsertoRoom", (data, roomId) => {
      console.log("hola event!");
      if (this.id === roomId) {
        this.updatePlayers(data);
      }
    });

    this.socket.on("notifyPlayGame", (data, roomId, userId) => {
      if (this.id === roomId) {
        this.initGame(data);
      }
    });

    this.socket.on("disableRoom", (roomId) => {
      if (this.id === roomId) {
        this.disableRoom(roomId);
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
    this.initGame(this.players, true);
  }

  prepareGame() {
    // Quitamos botón de play
    this.playButtonDiv.innerHTML = "";

    // seteamos la room a close
    this.isOpen = false;

    // deshabilitamos sala
    this.disableRoom(this.id);
  }

  async initGame(players, isCallWithEvent = false) {
    // Inicializamos juego
    const gridSize = 2;
    const currentPlayerInfo = this.storage.getLocalStorage("me", "session");
    this.game = new Game(
      this.id,
      currentPlayerInfo,
      players,
      this.socket,
      gridSize
    );

    document.getElementById("roomConnectedMessage").innerHTML = "";
    this.prepareGame(players);
    this.game.init(isCallWithEvent);

    if (isCallWithEvent) {
      this.socket.emit("playGame", {
        roomId: this.id,
        userId: currentPlayerInfo.id,
      });
    }
  }

  generateBubble(user, usersLength) {
    let marginClass = usersLength > 3 ? "fit-avatar-list" : "";
    return `<div class="a-avatar drag-item ${user.avatar} ${marginClass}" data-id="${user.id}" data-color="${user.avatar}" data-avatar="${user.avatar}"><i class="fas fa-user"></i></div>`;
  }
}

export default Room;
