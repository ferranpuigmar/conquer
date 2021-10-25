var Conquer;
/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/DashBoard.js":
/*!*****************************!*\
  !*** ./src/js/DashBoard.js ***!
  \*****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Room__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Room */ "./src/js/Room.js");


class Dashboard{
  rooms = [];

  constructor(initData){
    this.boxRooms = initData.boxRooms;
  }

  init(){
    this.generateRooms();
  }

  generateRooms(){
    this.boxRooms.forEach((box, index) => {
      // Generamos las instancias de las salas
      this.rooms[index] = new _Room__WEBPACK_IMPORTED_MODULE_0__["default"](box.id, `Room${index}`, 4);

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

/* harmony default export */ __webpack_exports__["default"] = (Dashboard);

/***/ }),

/***/ "./src/js/Game.js":
/*!************************!*\
  !*** ./src/js/Game.js ***!
  \************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
class Game
{
  colors = [ 'red', 'blue', 'green', 'brown' ];
  grid = []
  defeatedPlayers = [];
  wrapper = "";
  totalCellsToWin = 0;

  constructor (
    wrapper,
    players,
    gameSize
  )
  {
    this.players = this.buildToGamePlayers( players );
    this.gridSize = gameSize;
    this.totalCells = gameSize * gameSize;
    this.round = { turn: 1, roundNumber: 1, player: this.players[ 0 ] }
    this.grid = this.generateGrid(gameSize);
    this.wrapper = wrapper;
  }

  getPlayers ()
  {
    console.log( 'players: ', this.players );
  }

  getRoundInfo(){
    const newTurn = this.round.turn + 1;
    const isTurnEnd = newTurn > this.players.length;
    const newRoundTitle = isTurnEnd ? this.round.roundNumber + 1 : this.round.roundNumber;

    if(isTurnEnd){
      const rountDivSection = document.querySelector('#roundTitle h3');
      rountDivSection.innerHTML = `Round ${newRoundTitle}`
    }

    return {
      roundNumber: newRoundTitle,
      turn: isTurnEnd ? 1 : newTurn,
      player: isTurnEnd ? this.players[0] : this.players[ newTurn - 1]
    }
  }

  checkTurn ()
  {
    // Me descargo los updates del juego

    // Seteo las propiedades del juego con esa info
    this.round = this.getRoundInfo();
  }

  checkValidCellClick (cellObj, currentPlayer){
    // row de la casilla clickada
    const row = Number(cellObj.row);
    // celda de la casilla clickada
    const cell = Number(cellObj.cell);

    // Generamos posibles celdas adjacentes que pueden ser del jugador
    const nearCells = [
      `cell${row+1}-${cell}`,
      `cell${row}-${cell+1}`,
      `cell${row-1}-${cell}`,
      `cell${row}-${cell-1}`
    ]
    // Inicializamos un array para guardar las celdas 
    // adjacentes que pertenecen al jugador
    const validClick = []

    // Iteramos por el array de grid de nuestra clase Game para
    // cotejar si las celdas que estan en nearCells tienen registrado al
    // jugador, de modo que sabemos que son casillas en las que ha hecho click
    // anteriormente
    for(let i= 0; i < nearCells.length; i++){
      // buscamos dentro de nuestro registro de grid la id de celda
      const targetCell = this.grid.find(cell => cell.id === nearCells[i]);
      // Si la celda existe en el gri y además está registrado a nombre del jugador
      // añadimos una celda válida dentro de las posibles celdas adyacentes
      if(targetCell && targetCell.playerId === currentPlayer.id){
        validClick.push({validCell: true})
      }
    }

    // Retornamos un valor booleanos que nos dice si almenos una
    // de las casillas adjacentes a la casilla en la que se ha hecho click
    // pertenece al jugador
    return validClick.some(el => el.validCell)
  }

  checkCellClick ( e )
  {
    // chequeamos a que jugador le toca
    const currentPlayerTurn = this.round.player;

    // sacamos la id de la celda dentro del DOM
    // sacamos los data asciados al número de row y la celda
    const cellId = e.target.id;
    const cellObj = {
      row: e.target.dataset.row,
      cell: e.target.dataset.cell
    }
    const cell = document.getElementById(cellId);

    // comprobamos si es adjacente a la última seleccionada por el jugador
    // siempre y cuando no sea el primer turno
    if(this.round.roundNumber !== 1){
      let isCellFilled, isAValidCellClick;
      // comprobamos si está llena
      isCellFilled = cell.classList.contains('isFilled')
      // comprobamos si el click está en una casilla adjacente que pertenece al jugador
      isAValidCellClick = this.checkValidCellClick(cellObj, currentPlayerTurn);

      if(isCellFilled || !isAValidCellClick) {
        return
      };
    }

    // Añadimos la class isFilled que no permite pulsar la casilla
    cell.classList.add('isFilled');
    // Cambiamos la celda al color del jugador
    cell.style.backgroundColor= currentPlayerTurn.color;
    // Le sumamos 1 a sus casillas conquistadas
    // y registramos la id de la celda como última posición
    this.AddConqueredCell(currentPlayerTurn.id, cellId);

    // Comprobamos si ha ganado
    if(this.totalCellsToWin === currentPlayerTurn.cellsConquered){
      console.log('El jugador 1 ha ganado!!!')
    }

    // cambiamos el turno
    this.checkTurn()
  }

  AddConqueredCell(playerId, cellId){
    this.players = this.players.map(player => {
      if(player.id === playerId){
        player.cellsConquered += 1;
      }
      return player;
    })
    this.grid.forEach(cell => {
      if(cell.id === cellId){
        cell.playerId = this.round.player.id
      }
    })
  }

  createDomGrid ()
  {
    const size = this.gridSize;
    const wrapper = document.getElementById( this.wrapper );
    let rowCounter = 1;
    let cellCounter = 1;
    let cells = []

    for ( let i = 1; i <= size * size; i++ ) {
      let cellId = `cell${ rowCounter }-${ cellCounter }`;
      let cell = document.createElement( 'div' );
      cell.id = cellId;
      cell.className = `m-game-grid__cell cell-${rowCounter}-${cellCounter}`;
      cell.dataset.cell = cellCounter;
      cell.dataset.row = rowCounter;
      cell.addEventListener( 'click', this.checkCellClick.bind( this ), false );
      cells.push(cell);
      cellCounter++;

      // Si hay 20 celdas
      if ( i % size === 0) {
        // Creamos contenedor de la fila
        let row = document.createElement( 'div' );
        row.className = 'm-game-grid__row';

        // Añadimos las 20 celdas a la fila
        cells.forEach((cell, index) => {
          row.appendChild(cell);
        });

        // Añadimos la fila al grid del HTML
        wrapper.appendChild( row )

        // Reiniciamos el array de celdas, 
        // el contador de celdas a 1 
        // y añadimos 1 al contador de filas
        cells = [];
        cellCounter = 1;
        rowCounter++;
      }

      // registamos la id de la casilla en nuestro registro de grid
      this.grid[i-1] = {
        id: cell.id,
        playerId: null
      }
    }
  }

  generateGrid(gridSize){
    return [...Array(gridSize * gridSize)]
  }

  buildToGamePlayers ( players )
  {
    return players.map( ( player, index ) => ( {
      id: player.id,
      name: player.getName(),
      cellsConquered: 0,
      color: this.colors[ index ]
    } ) )
  }

  calculateTotalCellsToWin ( totalCells, players )
  {
    const numPlayers = players.length;
    const otherConqueredCells = this.defeatedPlayers.reduce((acc, player) => acc.cellsConquered + player.cellsConquered, 0); // X casillas conquistadas por otros jugadores

    this.totalCellsToWin =  Math.floor( (totalCells-otherConqueredCells) / numPlayers ) + 1
  }

  init(){
    this.createDomGrid();
    this.calculateTotalCellsToWin(this.totalCells, this.players)

    // Generamos listener para manejar cambios en el localStorage
  }
}

/* harmony default export */ __webpack_exports__["default"] = (Game);

/***/ }),

/***/ "./src/js/Player.js":
/*!**************************!*\
  !*** ./src/js/Player.js ***!
  \**************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
class Player {
  constructor(
    id,
    name,
    avatar
  ){
    this.id = id;
    this.name = name;
    this.avatar = avatar;
  }

  getName(){
    return this.name;
  }

  getAvatar(){
    return this.avatar;
  }
}

/* harmony default export */ __webpack_exports__["default"] = (Player);

/***/ }),

/***/ "./src/js/Register.js":
/*!****************************!*\
  !*** ./src/js/Register.js ***!
  \****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
class Register {

  fields = {}
  errors = {}

  constructor(registerFields){
    this.form = document.getElementById(registerFields.formId)
    this.emailInput = document.getElementById(registerFields.emailId);
    this.passwordInput = document.getElementById(registerFields.passwordId);
    this.favouriteRoom = document.getElementById(registerFields.favouriteRoomId);
    this.avatarWrapper = document.getElementById(registerFields.avatarWrapperId);
    this.registerSubmitBtn = document.getElementById(registerFields.submtBtn);
  }

  onSelectAvatar(e){
    const avatarMod = e.target.dataset.mod;
    const avatarId = e.target.id;
    const avatarDiv = document.getElementById(avatarId);

    const avatars = this.avatarWrapper.querySelectorAll('.a-avatar');
    avatars.forEach(avatar => {
      avatar.classList.remove('active')
    })

    avatarDiv.classList.add('active');
  }

  assignListeners(){
    const avatars = this.avatarWrapper.querySelectorAll('.a-avatar');
    avatars.forEach(avatar => {
      avatar.addEventListener('click', this.onSelectAvatar.bind(this));
    })

    this.form.addEventListener('submit', this.send.bind(this));
  }

  validateEmail(name, element, value){
    let message, isValid;

    if(value === ""){
      message = "El email no puede estar vacío"
      isValid = false;
    }

    if(value !== ""){
      const regex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      isValid = regex.test(value);
      message = isValid ? "" : "El email no es válido"
    }

    if(isValid) {
      delete this.errors[name];
      element.classList.remove('is-invalid')
      document.getElementById(`${element.id}_error`).innerHTML = "";
      this.fields[name].value = value;
      return;
    } else {
      this.fields[name].value = '';
    }

    this.errors[name] = {
      element: element,
      message
    }
  }

  validatePassword(name, element, value){

    const isValid = value !== "";
    const message = isValid ? '' : "El password no puede estar vacío";

    if(isValid) {
      delete this.errors[name];
      element.classList.remove('is-invalid')
      document.getElementById(`${element.id}_error`).innerHTML = "";
      this.fields[name].value = value
      return;
    } else {
      this.fields[name].value = '';
    }

    this.errors[name] = {
      element: element,
      message
    }
  }

  validateFavouriteRoom(name, element, value){
    const isValid = value !== "0";
    const message = isValid ? '' : "Debes seleccionar una sala";

    if(isValid) {
      delete this.errors[name];
      element.classList.remove('is-invalid')
      document.getElementById(`${element.id}_error`).innerHTML = "";
      this.fields[name].value = value;
      return;
    } else {
      this.fields[name].value = '';
    }

    this.errors[name] = {
      element: element,
      message
    }
  }

  registerFields(){
    const requiredFields = [
      {name: 'emailInput', element: this.emailInput, validate: this.validateEmail.bind(this)},
      {name: 'passwordInput', element: this.passwordInput, validate: this.validatePassword.bind(this)},
      {name: 'favouriteRoom', element: this.favouriteRoom, validate: this.validateFavouriteRoom.bind(this)}
    ]
    requiredFields.forEach(field => {
      this.fields[field.name] = {
        name: field.name,
        validate: field.validate,
        element: field.element,
        value: ''
      }
    })
  }

  init(){
    this.assignListeners();
    this.registerFields();
  }

  send(e){
    e.preventDefault();
    const fields = this.fields;

    Object.keys(fields).forEach(field => {
      this.fields[field].validate(fields[field].name, fields[field].element, fields[field].element.value)
    })

    const existErrors = Object.keys(this.errors).length !== 0;

    if(existErrors){
      Object.keys(this.errors).forEach(error => {
        const inputElement = this.errors[error].element;
        const msgErrorElement = `${inputElement.id}_error`;
        inputElement.classList.add('is-invalid');
        document.getElementById(msgErrorElement).innerHTML = this.errors[error].message;
      })
      return;
    }

    const data  = {
      email: this.fields.emailInput.value,
      password: this.fields.passwordInput.value,
      avatar: `mod${this.avatarWrapper.querySelector('.active').dataset.mod}`,
      favouriteRoom: this.fields.favouriteRoom.value
    };

    // Evento para enviar la información al localStorage, al apartado de usuaros registrados

  }

}

/* harmony default export */ __webpack_exports__["default"] = (Register);

/***/ }),

/***/ "./src/js/Room.js":
/*!************************!*\
  !*** ./src/js/Room.js ***!
  \************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
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
    // Creamos jugador que recoge los datos del usuario arrastrado
    const draggedPlayer = new Player(user.id, user.name, user.avatar);
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

/* harmony default export */ __webpack_exports__["default"] = (Room);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
!function() {
var __webpack_exports__ = {};
/*!*****************************!*\
  !*** ./src/sass/style.scss ***!
  \*****************************/
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin

}();
// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
!function() {
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Game": function() { return /* reexport safe */ _Game__WEBPACK_IMPORTED_MODULE_0__["default"]; },
/* harmony export */   "Player": function() { return /* reexport safe */ _Player__WEBPACK_IMPORTED_MODULE_1__["default"]; },
/* harmony export */   "Room": function() { return /* reexport safe */ _Room__WEBPACK_IMPORTED_MODULE_2__["default"]; },
/* harmony export */   "Dashboard": function() { return /* reexport safe */ _DashBoard__WEBPACK_IMPORTED_MODULE_3__["default"]; },
/* harmony export */   "Register": function() { return /* reexport safe */ _Register__WEBPACK_IMPORTED_MODULE_4__["default"]; }
/* harmony export */ });
/* harmony import */ var _Game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Game */ "./src/js/Game.js");
/* harmony import */ var _Player__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Player */ "./src/js/Player.js");
/* harmony import */ var _Room__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Room */ "./src/js/Room.js");
/* harmony import */ var _DashBoard__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./DashBoard */ "./src/js/DashBoard.js");
/* harmony import */ var _Register__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Register */ "./src/js/Register.js");







}();
Conquer = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=bundle.js.map