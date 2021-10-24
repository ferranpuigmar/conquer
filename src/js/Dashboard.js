class Dashboard{
  constructor(initData){
    this.boxRooms = initData.boxRooms;
  }

  init(){
    this.generateRoomBoxes();
  }

  generateRoomBoxes(){
    this.boxRooms.forEach((box, index) => {

      const boxDiv = document.getElementById(box.id);
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