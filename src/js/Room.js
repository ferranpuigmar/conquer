import { v4 as uuidv4 } from 'uuid';

class Room {
  capacity = 4;
  isOpen = true;
  players = [];
  roomBox = "";
  game = "";

  constructor(id, name, capacity){
    this.id = id;
    this.name = name;
    this.capacity = capacity;
  }

  onDraggPlayer(user){
    if(this.players.length === this.capacity){
      this.isOpen = false;
      disableRoom(this.id)
      console.log('sala llena!')
      return;
    }

    if(this.players.length > this.capacity || !this.isOpen){
      console.log('La sala no acepta más jugadores')
      return;
    }

    this.addToRoom(user);
  }

  addToRoom(user){
    const draggedPlayer = new Player(this.user.id, this.user.name, this.user.avatar);
    this.players.push(draggedPlayer)
    // Mostrar mensaje que se ha añadido un nuevo jugador

    if(this.players > 1){
      // Mostrar posibilidad de empezar a jugar
    }
  }

  disableRoom(id){
    const roomDivElement = document.getElementById(id);
    roomDivElement.classList.add('isFull');
  }

  getPlayers(){
    return players;
  }

  initGame(){
    // Quitamos botón de play

    // Inicializamos juego
    const gridSize = 20;
    this.game = Game('grid', this.players, gridSize);
    this.game.init();
  }


}

export default Room;