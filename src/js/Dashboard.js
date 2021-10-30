import DragAndDrop from "./DragAndDrop";
import Room from "./Room";

class Dashboard{
  rooms = [];
  dragAndDrop = new DragAndDrop();

  constructor(initData){
    this.boxRooms = initData.boxRooms;
  }

  init(){
    this.generateRooms();
    this.dragAndDrop.init();
  }

  generateRooms(){
    this.boxRooms.forEach((box, index) => {
      // Generamos las instancias de las salas
      this.rooms[index] = new Room(box.id, `Room${index}`, 4);

      const boxDiv = document.getElementById(box.id);

      // Añadir evento en alguna parte del box para cuando se hace drag&drop
      // Y que conecte con un método de la instancia de room

      // Añadir clase para pintar caja
      boxDiv.classList.add(`room${index+1}`);
      // Añadir títulos
      const title = `Room ${index + 1}`;
      const boxDivHeader = document.querySelector(`#${box.id} .m-room-drop-item__header h3`);
      boxDivHeader.innerHTML = title;


    })
  }
}

export default Dashboard;