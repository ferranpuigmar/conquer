import Room from "./Room";
import LocalStorage from "./utils";
import { io } from "socket.io-client";

class Dashboard {
  roomsList = [];
  localStorage = new LocalStorage();
  avatarMobile;
  socket = io(`127.0.0.1:3000`);

  constructor(initData) {
    this.boxRooms = initData.boxRooms;
  }

  init() {
    this.redirectToLogin();
    this.generateRooms();
    this.generatePlayerBox();
    this.generateLogout();
    this.avatarMobile = document.querySelector("#avatarMobile");
    //this.avatarMobile = new D
    avatarMobile.addEventListener(
      "dragstart",
      this.dragIniciado.bind(this),
      false
    );
    avatarMobile.addEventListener(
      "dragend",
      this.dragFinalizado.bind(this),
      false
    );
  }

  dragIniciado(e) {
    e.dataTransfer.setData("userAvatar", "avatarMobile");
  }

  dragFinalizado() {}

  generateRooms() {
    this.boxRooms.forEach((box, index) => {
      const roomName = `Room ${index + 1}`;
      // Generamos las instancias de las salas
      this.roomsList[index] = new Room(box.id, roomName, 4);
      // Iniciamos listeners para eventos del tipo storage
      this.roomsList[index].initStorageEvents();
      this.roomsList[index].initDragListeners();

      const boxDiv = document.getElementById(box.id);

      // Añadir clase para pintar caja
      boxDiv.classList.add(`room${index + 1}`);
      // Añadir títulos
      const boxDivHeader = document.querySelector(
        `#${box.id} .m-room-drop-item__header h3`
      );
      boxDivHeader.innerHTML = roomName;
    });

    this.generateStorageRooms();
  }

  generateStorageRooms() {
    // Comprobamos si ya hay rooms en el LocalStorage
    const existRooms = this.localStorage.getLocalStorage("roomsList");
    if (!existRooms) {
      // Generamos localStorage inicial para las rooms
      const roomsDataToStorage = this.roomsList.map((room) => ({
        id: room.id,
        usersRoom: [],
        isOpen: true,
        game: {
          grid: [],
          players: [],
          defeatedPlaters: [],
          totalCellsToWin: 0,
          round: {
            turn: 0,
            roundNumber: 0,
            player: null,
          },
        },
      }));
      const roomsDataType = {
        eventType: null,
        roomEventId: null,
        rooms: roomsDataToStorage,
      };
      this.localStorage.setLocalStorage("roomsList", roomsDataType);
    }
  }

  generatePlayerBox() {
    const data = this.localStorage.getLocalStorage("me", "session");

    if (data) {
      const player = data;
      const boxDiv = document.getElementById("my-user-box");
      const avatarDiv = boxDiv.querySelector(".a-avatar");
      const nameDiv = boxDiv.querySelector(".m-user-item__name");
      const roomDiv = boxDiv.querySelector(".m-user-item__room");
      const roomName = this.getRoomName(player.favouriteRoom);

      nameDiv.innerText = player.name;
      roomDiv.innerText = roomName;
      avatarDiv.dataset.id = player.id;
      avatarDiv.dataset.avatar = player.avatar;
      avatarDiv.dataset.color = player.color;
      avatarDiv.classList.add(player.avatar);

      if (this.isPlayerInRooms(player)) {
        avatarDiv.classList.add("hidden");
      } else {
        avatarDiv.classList.remove("hidden");
      }
    } else {
      // Aquí va la redicción si el usuario no esta conectado;
      console.log("usuario no conectado");
    }
  }

  generateLogout() {
    const logoutBtn = document.getElementById("logout");
    const player = this.localStorage.getLocalStorage("me", "session");

    logoutBtn.addEventListener("click", function () {
      this.rooms.takeOutFromRoom(player);
      this.localStorage.setLocalStorage("me", null, "session");
      this.redirectToLogin();
    });
  }

  isPlayerInRooms(player) {
    let allPlayers = [];
    this.roomsList.forEach((room) => {
      allPlayers.concat(room.players);
    });
    return !!allPlayers.find((pl) => pl.id === player.id);
  }

  getRoomName(id) {
    let index = -1;
    this.boxRooms.find(function (item, i) {
      if (item.id === id) {
        index = i;
        return i;
      }
    });
    return "ROOM " + (index + 1);
  }

  redirectToLogin() {
    let user = this.localStorage.getLocalStorage("me", "session");
    if (!user) {
      window.location.href = "/";
    }
  }
}

export default Dashboard;
