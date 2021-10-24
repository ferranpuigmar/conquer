var Conquer;
/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/uuid/dist/esm-browser/regex.js":
/*!*****************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/regex.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/rng.js":
/*!***************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/rng.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ rng; }
/* harmony export */ });
// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
    // find the complete implementation of crypto (msCrypto) on IE11.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }

  return getRandomValues(rnds8);
}

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/stringify.js":
/*!*********************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/stringify.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validate.js */ "./node_modules/uuid/dist/esm-browser/validate.js");

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

var byteToHex = [];

for (var i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0,_validate_js__WEBPACK_IMPORTED_MODULE_0__["default"])(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

/* harmony default export */ __webpack_exports__["default"] = (stringify);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/v4.js":
/*!**************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/v4.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _rng_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rng.js */ "./node_modules/uuid/dist/esm-browser/rng.js");
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist/esm-browser/stringify.js");



function v4(options, buf, offset) {
  options = options || {};
  var rnds = options.random || (options.rng || _rng_js__WEBPACK_IMPORTED_MODULE_0__["default"])(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (var i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0,_stringify_js__WEBPACK_IMPORTED_MODULE_1__["default"])(rnds);
}

/* harmony default export */ __webpack_exports__["default"] = (v4);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/validate.js":
/*!********************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/validate.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _regex_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./regex.js */ "./node_modules/uuid/dist/esm-browser/regex.js");


function validate(uuid) {
  return typeof uuid === 'string' && _regex_js__WEBPACK_IMPORTED_MODULE_0__["default"].test(uuid);
}

/* harmony default export */ __webpack_exports__["default"] = (validate);

/***/ }),

/***/ "./src/js/Game.js":
/*!************************!*\
  !*** ./src/js/Game.js ***!
  \************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uuid */ "./node_modules/uuid/dist/esm-browser/v4.js");



class Game
{
  colors = [ 'red', 'blue', 'green', 'brown' ];
  grid = []
  constructor (
    players,
    gameSize
  )
  {
    this.players = this.buildToGamePlayers( players );
    this.gridSize = gameSize;
    this.totalCells = gameSize * gameSize;
    this.totalCellsToWin = this.calculateTotalCellsToWin( this.totalCells, this.players )
    this.round = { turn: 1, roundNumber: 1, player: this.players[ 0 ] }
    this.grid = this.generateGrid(gameSize);
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

  createDomGrid ( targetDomElement )
  {
    const size = this.gridSize;
    const wrapper = document.getElementById( targetDomElement );
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
      id: (0,uuid__WEBPACK_IMPORTED_MODULE_0__["default"])(),
      name: player.getName(),
      cellsConquered: 0,
      color: this.colors[ index ]
    } ) )
  }

  calculateTotalCellsToWin ( totalCells, players )
  {
    const numPlayers = players.length;

    return Math.floor( totalCells / numPlayers ) + 1
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
  name = "";
  avatar = "";

  constructor(
    name,
    avatar
  ){
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

/***/ "./src/js/Room.js":
/*!************************!*\
  !*** ./src/js/Room.js ***!
  \************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
class Room {
  constructor(name){
    this.name = name;
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
/* harmony export */   "Room": function() { return /* reexport safe */ _Room__WEBPACK_IMPORTED_MODULE_2__["default"]; }
/* harmony export */ });
/* harmony import */ var _Game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Game */ "./src/js/Game.js");
/* harmony import */ var _Player__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Player */ "./src/js/Player.js");
/* harmony import */ var _Room__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Room */ "./src/js/Room.js");





}();
Conquer = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=bundle.js.map