var Conquer;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/DashBoard.js":
/*!*****************************!*\
  !*** ./src/js/DashBoard.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Dashboard);

/***/ }),

/***/ "./src/js/Game.js":
/*!************************!*\
  !*** ./src/js/Game.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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

  checkValidCellClick (cellObj, id){
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
      if(targetCell && targetCell.playerId === id){
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
      isAValidCellClick = this.checkValidCellClick(cellObj, currentPlayerTurn.id);

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

    // Comprobamos que ninguno de los otros jugadores 
    // ha perdido.
    this.checkOtherPlayerLoss(currentPlayerTurn.id);

    // Comprobamos si ha ganado
    if(this.totalCellsToWin === currentPlayerTurn.cellsConquered || this.players.length == 1){
      console.log(`El jugador ${currentPlayerTurn.name} ha ganado!!!`);
    }

    // cambiamos el turno
    this.checkTurn()
  }

  checkOtherPlayerLoss(currentPlayerId){
      console.log(currentPlayerId);
      let otherPlayers = this.players.filter((o)=> o.id !== currentPlayerId);
      let defeated = [];
      otherPlayers.forEach((player) => {
        let aux = true;
        console.log(player);
          let conqueredCells = this.grid.filter((c)=> c.playerId == player.id);

          if(conqueredCells.length > 0){
            conqueredCells.forEach((cellObj)=>{
              console.log(cellObj);
              if(this.checkValidCellClick(cellObj, null)){
                aux = false;
              }
            })
          }else{
            aux= false;
          }
        if(aux){ defeated.push(player); };
      });

      if(defeated.length > 0){
        defeated.forEach((player)=>{
          console.log(player);
          this.defeatedPlayers.push(player);
          this.players = this.players.filter(oplayer => oplayer.id !== player.id);
        });

        return true;
      }
      return false;
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
      cell.row = rowCounter;
      cell.cell = cellCounter;
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
        row: cell.row,
        cell: cell.cell,
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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Game);

/***/ }),

/***/ "./src/js/Player.js":
/*!**************************!*\
  !*** ./src/js/Player.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Player);

/***/ }),

/***/ "./src/js/Room.js":
/*!************************!*\
  !*** ./src/js/Room.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Room);

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
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
var __webpack_exports__ = {};
/*!*****************************!*\
  !*** ./src/sass/style.scss ***!
  \*****************************/
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Game": () => (/* reexport safe */ _Game__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   "Player": () => (/* reexport safe */ _Player__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   "Room": () => (/* reexport safe */ _Room__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   "Dashboard": () => (/* reexport safe */ _DashBoard__WEBPACK_IMPORTED_MODULE_3__["default"])
/* harmony export */ });
/* harmony import */ var _Game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Game */ "./src/js/Game.js");
/* harmony import */ var _Player__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Player */ "./src/js/Player.js");
/* harmony import */ var _Room__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Room */ "./src/js/Room.js");
/* harmony import */ var _DashBoard__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./DashBoard */ "./src/js/DashBoard.js");






})();

Conquer = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=bundle.js.map