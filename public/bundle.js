var Conquer;
/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/Game.js":
/*!************************!*\
  !*** ./src/js/Game.js ***!
  \************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
class Game
{
  colors = [ 'red', 'blue', 'green', 'brown' ]
  constructor (
    players,
    gameSize
  )
  {
    this.players = this.buildToGamePlayers( players );
    this.gridSize = gameSize;
    this.totalCells = gameSize * gameSize;
    this.totalCellsToWin = this.calculateTotalCellsToWin( this.totalCells, this.players )
    this.turn = { round: 1, player: this.players[ 0 ] }
  }

  getPlayers ()
  {
    console.log( 'players: ', this.players );
  }

  checkTurn ()
  {
    const currentTurn = this.turn;

  }

  checkCellClick ( e )
  {
    const cellDivElement = document.getElementById( e.target.id );
    console.log( 'click event...' )
    this.removeCellClick( cellDivElement )
  }

  removeCellClick ( div )
  {
    div.removeEventListener( 'click', this.checkCellClick, false )
  }

  createGrid ( targetDomElement )
  {
    const size = this.gridSize;
    const wrapper = document.getElementById( targetDomElement );
    let counter = 1;
    for ( let i = 0; i < size * size; i++ ) {
      let row = document.createElement( 'div' );
      row.className = 'row';

      for ( let j = 1; j <= size; j++ ) {
        let cell = document.createElement( 'div' );
        cell.id = `cell${ counter }-${ j }`;
        cell.className = 'cell';
        cell.dataset.cell = j;
        cell.dataset.row = counter;
        row.appendChild( cell );
        cell.addEventListener( 'click', this.checkCellClick.bind( this ), false )
      }

      if ( i % size === 0 ) {
        wrapper.appendChild( row )
        counter++;
      }
    }
  }

  buildToGamePlayers ( players )
  {
    return players.map( ( player, index ) => ( {
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