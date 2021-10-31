import DragAndDrop from "./DragAndDrop";
import Room from "./Room";
import LocalStorage from "./utils";

class Dashboard {
  rooms = [];
  dragAndDrop = new DragAndDrop();
  localStorage = new LocalStorage();

  constructor(initData) {
    this.boxRooms = initData.boxRooms;
  }

  init() {
    this.generateRooms();
    this.dragAndDrop.init();
  }

  generateRooms() {
    this.boxRooms.forEach((box, index) => {
      // Generamos las instancias de las salas
      this.rooms[index] = new Room(box.id, `Room${index}`, 4);
      // Iniciamos listeners para eventos del tipo storage
      this.rooms[index].initStorageEvents();

      const boxDiv = document.getElementById(box.id);

      // Añadir evento en alguna parte del box para cuando se hace drag&drop
      // Y que conecte con un método de la instancia de room

      // Añadir clase para pintar caja
      boxDiv.classList.add(`room${index + 1}`);
      // Añadir títulos
      const title = `Room ${index + 1}`;
      const boxDivHeader = document.querySelector(
        `#${box.id} .m-room-drop-item__header h3`
      );
      boxDivHeader.innerHTML = title;
    });

    // Generamos localStorage inicial para las rooms
    const roomDataToStorage = this.rooms.map((room) => ({
      id: room.id,
      userRooms: [],
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
    this.localStorage.setLocalStorage("rooms", roomDataToStorage);

    //Temporal, añadimos user a la priemra sala
    const currentUserData = this.localStorage.getLocalStorage("me", "session");
    const currentRoom = this.rooms[0];
    currentRoom.addToRoom(currentUserData);
  }

  generatePlayerBox() {
    const data = this.local.getLocalStorage("me", "session");
    if (data) {
    } else {
      console.log(data);
    }
  }
}

export default Dashboard;
