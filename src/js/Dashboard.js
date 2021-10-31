import DragAndDrop from "./DragAndDrop";
import Room from "./Room";
import LocalStorage from "./utils";

class Dashboard {
  rooms = [];
  dragAndDrop = new DragAndDrop();
  local = new LocalStorage();

  constructor(initData) {
    this.boxRooms = initData.boxRooms;
  }

  init() {
    this.generateRooms();
    this.generatePlayerBox();
    this.dragAndDrop.init();
  }

  generateRooms() {
    this.boxRooms.forEach((box, index) => {
      // Generamos las instancias de las salas
      this.rooms[index] = new Room(box.id, `Room${index}`, 4);

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
  }

  generatePlayerBox(){
    const data = this.local.getLocalStorage('me','session');

    if(data){
      const player    = data;
      const boxDiv    = document.getElementById('my-user-box');
      const avatarDiv = boxDiv.querySelector('.a-avatar');
      const nameDiv   = boxDiv.querySelector('.m-user-item__name');
      const roomDiv   = boxDiv.querySelector('.m-user-item__room');
      const roomName  = this.getRoomName(player.favouriteRoom);

      nameDiv.innerText         = player.email;
      roomDiv.innerText         = roomName;
      avatarDiv.dataset.id      = player.id;
      avatarDiv.dataset.avatar  = player.avatar;
      avatarDiv.dataset.color   = player.color;
      avatarDiv.classList.add(player.avatar);

      if(this.isPlayerInRooms(player)){
        avatarDiv.classList.add('hidden');
      }else{
        avatarDiv.classList.remove('hidden');
      };

    }else{
      // Aquí va la redicción si el usuario no esta conectado;
      console.log("usuario no conectado");
    }
  }

  isPlayerInRooms(player){
      let allPlayers = [];
      this.rooms.forEach((room)=>{ allPlayers.concat(room.players); });
      return !!allPlayers.find((pl)=>pl.id === player.id);
  }

  getRoomName(id){
    var index = -1;
    var room = this.boxRooms.find(
      function(item, i){ if(item.id === id){ index = i; return i;}
    });
    console.log(room, index);
    return 'ROOM '+(index + 1);
  }
}

export default Dashboard;
