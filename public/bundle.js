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

/***/ "./src/js/DashBoard.js":
/*!*****************************!*\
  !*** ./src/js/DashBoard.js ***!
  \*****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _DragAndDrop__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DragAndDrop */ "./src/js/DragAndDrop.js");
/* harmony import */ var _Room__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Room */ "./src/js/Room.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./src/js/utils.js");




class Dashboard {
  roomsList = [];
  dragAndDrop = new _DragAndDrop__WEBPACK_IMPORTED_MODULE_0__["default"]();
  localStorage = new _utils__WEBPACK_IMPORTED_MODULE_2__["default"]();

  constructor(initData) {
    this.boxRooms = initData.boxRooms;
  }

  init() {
    this.redirectToLogin();
    this.generateRooms();
    this.generatePlayerBox();
    this.generateLogout();
    this.dragAndDrop.init();
  }

  generateRooms() {
    this.boxRooms.forEach((box, index) => {
      const roomName = `Room ${index + 1}`;
      // Generamos las instancias de las salas
      this.roomsList[index] = new _Room__WEBPACK_IMPORTED_MODULE_1__["default"](box.id, roomName, 4);
      // Iniciamos listeners para eventos del tipo storage
      this.roomsList[index].initStorageEvents();

      const boxDiv = document.getElementById(box.id);

      // Añadir evento en alguna parte del box para cuando se hace drag&drop
      // Y que conecte con un método de la instancia de room

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

    //Temporal, añadimos user a la primera sala
    const currentUserData = this.localStorage.getLocalStorage("me", "session");
    const currentRoom = this.roomsList[0];
    currentRoom.addToRoom(currentUserData);
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

  generateLogout(){
      const logoutBtn = document.getElementById('logout');
      const player = this.localStorage.getLocalStorage("me", "session");

      logoutBtn.addEventListener('click', function(){
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

  redirectToLogin(){
    let user = this.localStorage.getLocalStorage("me", "session");
    if(!user){
      window.location.href = "/";
    }
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Dashboard);


/***/ }),

/***/ "./src/js/DragAndDrop.js":
/*!*******************************!*\
  !*** ./src/js/DragAndDrop.js ***!
  \*******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
class DragAndDrop {
  drageando(ev) {
    console.log("c");
    ev.dataTransfer.setData("text", ev.target.id);
  }

  dragIniciado(e) {
    console.log("a");
    this.style.opacity = 0.25;
    let padre = document.createElement("p");
    let clon = this.cloneNode(true);
    padre.appendChild(clon);
    e.dataTransfer.setData("text", padre.innerHTML);
  }

  dragFinalizado(e) {
    console.log("b");
    this.style.opacity = 0.25;
  }

  dragEntraContenedor(e) {
    console.log("hola...");
    //e.preventDefault();
  }

  dragSobreContenedor(e) {
    e.preventDefault();
    this.classList.add("over");
    return false;
  }

  dragFueraContenedor(e) {
    this.classList.remove("over");
  }

  controlDrop(e) {
    //recuperar datos usuario de sesionStorage
    contenedor.appendChild(avatarMobile);
    let datos = e.dataTransfer.getData("text");
    this.innerHTML += datos;
  }

  init() {
    let avatarMobile = document.querySelector("#avatarMobile");
    avatarMobile.addEventListener("dragstart", this.dragIniciado, false);
    avatarMobile.addEventListener("dragend", this.dragFinalizado, false);
    avatarMobile.addEventListener("drag", this.drageando, false);

    document.querySelectorAll(".m-room-drop-item__image").forEach((el) => {
      el.addEventListener("dragenter", this.dragEntraContenedor, false);
      el.addEventListener("dragover", this.dragSobreContenedor, false);
      el.addEventListener("dragleave", this.dragFueraContenedor, false);
      el.addEventListener("drop", this.controlDrop, false);
    });
  }
}

/* harmony default export */ __webpack_exports__["default"] = (DragAndDrop);


/***/ }),

/***/ "./src/js/Game.js":
/*!************************!*\
  !*** ./src/js/Game.js ***!
  \************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "./src/js/constants.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./src/js/utils.js");



class Game {
  colors = ["Purple", "Aquamarine", "CadetBlue", "DeepPink"];
  grid = [];
  defeatedPlayers = [];
  wrapper = document.getElementById("grid");
  totalCellsToWin = 0;
  storage = new _utils__WEBPACK_IMPORTED_MODULE_1__["default"]();
  waittingDiv = document.querySelector("#roomMessage"); // Div del mensaje de espera
  roomsList;
  roundTitle = document.getElementById("roundTitle"); // Número del Round
  pannelInfo = document.getElementById("roomPannelInfo");

  constructor(roomId, playerInfo, players, gameSize) {
    this.player = playerInfo;
    this.players = this.userToPlayerDTO(players);
    this.gridSize = gameSize;
    this.totalCells = gameSize * gameSize;
    this.round = { turn: 1, roundNumber: 1, player: this.players[0] };
    this.grid = this.generateGrid(gameSize);
    this.roomId = roomId;
  }

  isMyTurn(round) {
    return round.player.id === this.player.id;
  }

  getPlayers() {
    return this.players;
  }

  // Método que calcula la nueva info del Round después de un movimiento
  calculateNewRoundInfo() {
    const newTurn = this.round.turn + 1;
    const isTurnEnd = newTurn > this.players.length;
    const newRoundTitle = isTurnEnd
      ? this.round.roundNumber + 1
      : this.round.roundNumber;

    // Si el último jugador ha movido cambiamos el número del Round
    // si no, aumentamos en 1 el turno
    if (isTurnEnd) {
      this.roundTitle.querySelector("span").innerHTML = newRoundTitle;
    }

    return {
      roundNumber: newRoundTitle,
      turn: isTurnEnd ? 1 : newTurn,
      player: isTurnEnd ? this.players[0] : this.players[newTurn - 1],
    };
  }

  showRoomMessage(type) {
    let message;
    const messageDiv = document.querySelector("#roomMessage");
    switch (type) {
      case _constants__WEBPACK_IMPORTED_MODULE_0__.MESSAGE_TYPES.WAITTING_TURN:
        message = `Es el turno de  ${this.round.player.name}, espera a que haga su movimiento`;
        break;
      case _constants__WEBPACK_IMPORTED_MODULE_0__.MESSAGE_TYPES.HAS_LOST:
        message = `Lo sentimos ${this.player.name}, te han dejado sin casillas. ¡Has perdido!`;
        break;
      default:
        return "";
    }
    this.waittingDiv.classList.remove("d-none");
    const messageType = this.player.hasLost ? "danger" : "info";
    const messageContentDiv = `<div class="alert alert-${messageType} fade show" role="alert">
                <span id="roomMessageContent">${message}</span>
              </div>`;
    messageDiv.innerHTML = messageContentDiv;
  }

  hideRoomMessage() {
    this.waittingDiv.classList.add("d-none");
    this.waittingDiv.innerHTML = "";
  }

  // Método que chequea que sea el turno del jugador
  // y actualiza la información del juego que viene por el localStorage
  checkTurn(currentRoom) {
    if (this.round.player.id !== this.player.id) {
      this.showRoomMessage(_constants__WEBPACK_IMPORTED_MODULE_0__.MESSAGE_TYPES.WAITTING_TURN);
    } else {
      this.hideRoomMessage();
    }

    // Actualizamos juego para el jugador
    const updateGame = currentRoom.game;
    this.roundTitle.querySelector("span").innerHTML =
      updateGame.round.roundNumber;

    // Iteramos sobre las celdas del grid del DOM
    // las cotejamos con nuestro grid actualizado del localStorage
    // Si existe un id dentro del grid que es = a el del id de la cell
    // cambiamos el color de la celda
    const cells = this.wrapper.querySelectorAll(".m-game-grid__cell");
    cells.forEach((cell, index) => {
      const cellId = cell.id;
      if (this.grid[index].id && this.grid[index].id === cellId) {
        cell.style.backgroundColor = this.grid[index].color;
      }
    });
  }

  // Método que calcula que casillas son clicables por el jugador
  // de momento es en cruz
  checkValidCellClick(cellObj, id) {
    // row de la casilla clickada
    const row = Number(cellObj.row);
    // celda de la casilla clickada
    const cell = Number(cellObj.cell);

    // Generamos posibles celdas adjacentes que pueden ser del jugador
    const nearCells = [
      `cell${row + 1}-${cell}`,
      `cell${row}-${cell + 1}`,
      `cell${row - 1}-${cell}`,
      `cell${row}-${cell - 1}`,
    ];
    // Inicializamos un array para guardar las celdas
    // adjacentes que pertenecen al jugador
    const validClick = [];

    // Iteramos por el array de grid de nuestra clase Game para
    // cotejar si las celdas que estan en nearCells tienen registrado al
    // jugador, de modo que sabemos que son casillas en las que ha hecho click
    // anteriormente
    for (let i = 0; i < nearCells.length; i++) {
      // buscamos dentro de nuestro registro de grid la id de celda
      const targetCell = this.grid.find((cell) => cell.id === nearCells[i]);
      // Si la celda existe en el gri y además está registrado a nombre del jugador
      // añadimos una celda válida dentro de las posibles celdas adyacentes
      if (targetCell && targetCell.playerId === id) {
        validClick.push({ validCell: true });
      }
    }

    // Retornamos un valor booleanos que nos dice si almenos una
    // de las casillas adjacentes a la casilla en la que se ha hecho click
    // pertenece al jugador
    return validClick.some((el) => el.validCell);
  }

  // Método que chequea la celda que se ha clicado en el tablero
  // Chequeamos que sea clicable
  // Chequeamos si el jugador ha ganado
  // Actualizamos el localStorage con ese clic
  checkCellClick(e) {
    if (!this.isMyTurn(this.round)) return;

    // chequeamos a que jugador le toca
    const currentPlayerTurn = this.round.player;

    // sacamos la id de la celda dentro del DOM
    // sacamos los data asciados al número de row y la celda
    const cellId = e.target.id;
    const cellObj = {
      row: e.target.dataset.row,
      cell: e.target.dataset.cell,
    };
    const cell = document.getElementById(cellId);

    // comprobamos si es adjacente a la última seleccionada por el jugador
    // siempre y cuando no sea el primer turno
    if (this.round.roundNumber !== 1) {
      let isCellFilled, isAValidCellClick;
      // comprobamos si está llena
      isCellFilled = cell.classList.contains("isFilled");
      // comprobamos si el click está en una casilla adjacente que pertenece al jugador
      isAValidCellClick = this.checkValidCellClick(
        cellObj,
        currentPlayerTurn.id
      );

      if (isCellFilled || !isAValidCellClick) {
        return;
      }
    }

    // Añadimos la class isFilled que no permite pulsar la casilla
    cell.classList.add("isFilled");
    // Cambiamos la celda al color del jugador
    cell.style.backgroundColor = currentPlayerTurn.color;
    // Le sumamos 1 a sus casillas conquistadas
    // y registramos la id de la celda como última posición
    this.AddConqueredCell(currentPlayerTurn.id, cellId);

    // Comprobamos que ninguno de los otros jugadores
    // ha perdido.
    this.checkOtherPlayerLoss(currentPlayerTurn.id);

    // Comprobamos si ha ganado
    if (this.totalCellsToWin === currentPlayerTurn.cellsConquered) {
      console.log(`El jugador ${currentPlayerTurn.name} ha ganado!!!`);
    }

    if (this.players.length == 1) {
      console.log(`El jugador ${this.players[0].name} ha ganado!!!`);
    }

    // Actualizamos información del round
    this.round = this.calculateNewRoundInfo();

    const newGameToStorage = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.getNewGameInfo)(this);

    // Enviamos update al storage
    this.updateGame(this.getRoomsList(), newGameToStorage);
    const currentRoom = this.getRoomsList().rooms.find(
      (room) => room.id === this.roomId
    );
    this.checkTurn(currentRoom);
  }

  // Devuelve la key roomsList del localStorage
  getRoomsList() {
    return this.storage.getLocalStorage("roomsList");
  }

  checkOtherPlayerLoss(currentPlayerId) {
    let otherPlayers = this.players.filter(
      (otherPlayer) => otherPlayer.id !== currentPlayerId
    );
    let defeated = [];
    otherPlayers.forEach((player) => {
      let playerHasLost = true;
      let conqueredCells = this.grid.filter(
        (cell) => cell.playerId === player.id
      );

      if (conqueredCells.length > 0) {
        conqueredCells.forEach((cellObj) => {
          if (this.checkValidCellClick(cellObj, null)) {
            playerHasLost = false;
          }
        });
      } else {
        playerHasLost = false;
      }
      if (playerHasLost) {
        defeated.push(player);
      }
    });

    // Si hay jugadores que han sido eliminados
    // los añadimos al state de defeatedPlayers
    // enviamos evento para que se enteren que han perdido
    if (defeated.length > 0) {
      defeated.forEach((player) => {
        this.defeatedPlayers.push(player);
        this.players = this.players.filter(
          (oplayer) => oplayer.id !== player.id
        );
        // Enviamos evento que el user ha perdido
        const newGameToStorage = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.getNewGameInfo)(this);
        this.notifySomeoneHasLost(newGameToStorage);
      });

      this.calculateTotalCellsToWin(this.totalCells, this.players);
      return true;
    }

    return false;
  }

  // Método que añade una casilla al total
  // de casillas conquistadas del jugador
  AddConqueredCell(playerId, cellId) {
    this.players = this.players.map((player) => {
      if (player.id === playerId) {
        player.cellsConquered += 1;
      }
      return player;
    });
    this.grid.forEach((cell) => {
      if (cell.id === cellId) {
        cell.playerId = this.round.player.id;
        cell.color = this.round.player.color;
      }
    });
  }

  defeatPlayer(player) {
    this.defeatedPlayers.push(player);
    this.players = this.players.filter((oplayer) => oplayer.id !== player.id);
    console.log(`El jugador ${player.name} ha perdido!!!`);
  }

  takeOutFromGame(player) {
    let is_in = this.players.find(
      (current_player) => current_player.id === player.id
    );
    if (!!is_in) {
      this.defeatPlayer(player);
      this.calculateTotalCellsToWin(this.totalCells, this.players);
    }
  }

  createDomGrid() {
    const size = this.gridSize;
    this.wrapper.innerHTML = "";
    let rowCounter = 1;
    let cellCounter = 1;
    let cells = [];

    for (let i = 1; i <= size * size; i++) {
      let cellId = `cell${rowCounter}-${cellCounter}`;
      let cell = document.createElement("div");
      cell.id = cellId;
      cell.row = rowCounter;
      cell.cell = cellCounter;
      cell.className = `m-game-grid__cell cell-${rowCounter}-${cellCounter}`;
      cell.dataset.cell = cellCounter;
      cell.dataset.row = rowCounter;
      cell.addEventListener("click", this.checkCellClick.bind(this), false);
      cells.push(cell);
      cellCounter++;

      // Si hay 20 celdas
      if (i % size === 0) {
        // Creamos contenedor de la fila
        let row = document.createElement("div");
        row.className = "m-game-grid__row";

        // Añadimos las 20 celdas a la fila
        cells.forEach((cell, index) => {
          row.appendChild(cell);
        });

        // Añadimos la fila al grid del HTML
        this.wrapper.appendChild(row);

        // Reiniciamos el array de celdas,
        // el contador de celdas a 1
        // y añadimos 1 al contador de filas
        cells = [];
        cellCounter = 1;
        rowCounter++;
      }

      // registamos la id de la casilla en nuestro registro de grid
      this.grid[i - 1] = {
        id: cell.id,
        row: cell.row,
        cell: cell.cell,
        playerId: null,
        color: null,
      };
    }
  }

  createLegend(players) {
    const existingPlayers = players ?? this.players;
    const userLegend = existingPlayers
      .map(
        (player) =>
          `<li><span style="background-color: ${player.color}"></span><span>${player.name}</span></li>`
      )
      .join("");
    this.pannelInfo.innerHTML = `<span>Jugadores:</span> <ul>${userLegend}</ul>`;
  }

  // Método que inicializa el registro de grid según las dimensiones
  generateGrid(gridSize) {
    return [...Array(gridSize * gridSize)];
  }

  // Método que transforma los datos que nos llegan de los usuarios
  // a datos de jugador que necesitamos para gestionar el juego
  userToPlayerDTO(players) {
    return players.map((player, index) => ({
      id: player.id,
      name: player.name,
      cellsConquered: 0,
      color: this.colors[index],
      hasLost: false,
    }));
  }

  // Método que calcula el total de celdas que tiene
  // que rellenar un jugador para ganar
  calculateTotalCellsToWin(totalCells, players) {
    const numPlayers = players.length;
    let totalDefeatedCells = 0;

    this.defeatedPlayers.forEach((defeatyedPlayer) => {
      const cellsConquered = defeatyedPlayer.cellsConquered;
      totalDefeatedCells += cellsConquered;
    });

    this.totalCellsToWin =
      Math.floor((totalCells - totalDefeatedCells) / numPlayers) + 1;
  }

  //Evento para notificar que alguien ha perdido
  notifySomeoneHasLost(newGameInfo) {
    const updateRooms = this.getRoomsList().rooms.map((room) => {
      if (room.id === this.roomId) {
        room.game = newGameInfo;
      }
      return room;
    });

    const roomListUpdate = {
      eventType: _constants__WEBPACK_IMPORTED_MODULE_0__.EVENT_TYPES.SOMEONE_HAS_LOST,
      roomEventId: this.roomId,
      rooms: updateRooms,
    };

    this.storage.setLocalStorage("roomsList", roomListUpdate);
  }

  // Método que inicializa el juego
  init(isCallWithEvent) {
    this.createDomGrid();
    this.calculateTotalCellsToWin(this.totalCells, this.players);
    this.initStorageEvents();
    this.roundTitle.querySelector("span").innerHTML = 1;
    this.roundTitle.classList.remove("d-none");
    this.createLegend();

    if (!this.isMyTurn(this.round)) {
      this.showRoomMessage(_constants__WEBPACK_IMPORTED_MODULE_0__.MESSAGE_TYPES.WAITTING_TURN);
    }

    // Inicializamos los datos del juego partiendo del orden establecido
    // por orden de conexión a la sala, que viene dado por el userRomms del localStorage
    // mediante isCallWithEvent, si el juego se ha inciado por evento no lo hacemos ya que
    // inicialmente ya lo ha iniciado el primero que le ha dado al botón de play
    if (!isCallWithEvent) {
      const initNewGameToStorage = {
        defeatedPlayers: this.defeatedPlayers,
        grid: this.grid,
        players: this.players,
        round: this.round,
        totalCellsToWin: this.totalCellsToWin,
      };

      this.updateGame(this.getRoomsList(), initNewGameToStorage);
    }
  }

  // Método que actualiza el localStorage del juego
  // y añade un evento del tipo update para que el listener del storage
  // reaccione en el resto de tabs de jugador
  updateGame(roomsList, newGameInfo) {
    const updateRooms = roomsList.rooms.map((room) => {
      if (room.id === this.roomId) {
        room.game = newGameInfo;
      }
      return room;
    });

    const roomListUpdate = {
      eventType: _constants__WEBPACK_IMPORTED_MODULE_0__.EVENT_TYPES.UPDATE_GAME,
      roomEventId: this.roomId,
      rooms: updateRooms,
    };

    this.storage.setLocalStorage("roomsList", roomListUpdate);
  }

  // Método que añade el evento storage al juego
  initStorageEvents() {
    window.addEventListener("storage", (e) => {
      // por cada sala se lanza este evento
      if (e.key === "roomsList") {
        const roomsList = JSON.parse(e.newValue);

        switch (roomsList.eventType) {
          case _constants__WEBPACK_IMPORTED_MODULE_0__.EVENT_TYPES.UPDATE_GAME:
            !this.player.hasLost && this.handleUpdateEventGame(roomsList);
            break;
          case _constants__WEBPACK_IMPORTED_MODULE_0__.EVENT_TYPES.SOMEONE_HAS_LOST:
            !this.player.hasLost && this.handleSomeoneHasLostEvent(roomsList);
            break;
          default:
            return;
        }
      }
    });
  }

  // Recibe el evento update y cambia la info de los demás jugadores
  // que estan conectados a la partida y aún no es su turno
  handleUpdateEventGame(roomsList) {
    console.log("update game from event");
    // Si la sala no es la que tiene el evento no hacemos nada
    if (roomsList.roomEventId !== this.roomId) return;

    const currentRoom = roomsList.rooms.find(
      (room) => room.id === roomsList.roomEventId
    );

    // Actualizamos grid de la clase
    this.grid = currentRoom.game.grid;
    this.round = currentRoom.game.round;
    this.totalCellsToWin = currentRoom.game.totalCellsToWin;
    this.players = currentRoom.game.players;

    // Chequeamos el turno del jugador
    this.checkTurn(currentRoom);
  }

  // Recibe el evento que alguien ha perdido y lo notifica a aquella id
  // de usuariso que corresponda
  handleSomeoneHasLostEvent(roomsList) {
    // Si la sala no es la que tiene el evento no hacemos nada
    if (roomsList.roomEventId !== this.roomId) return;

    const currentRoom = roomsList.rooms.find(
      (room) => roomsList.roomEventId === room.id
    );

    // Sacamos las id que hay dentro de los array de jugadores que han perdido
    const defeatedPlayersId = currentRoom.game.defeatedPlayers.map(
      (defeatedPlayer) => defeatedPlayer.id
    );

    if (defeatedPlayersId.includes(this.player.id)) {
      this.showRoomMessage(_constants__WEBPACK_IMPORTED_MODULE_0__.MESSAGE_TYPES.HAS_LOST);
      this.player.hasLost = true;
      this.createLegend(currentRoom.game.players);
    }
  }
}

/* harmony default export */ __webpack_exports__["default"] = (Game);


/***/ }),

/***/ "./src/js/Login.js":
/*!*************************!*\
  !*** ./src/js/Login.js ***!
  \*************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/js/utils.js");



class Login {
  fields = {};
  errors = {};
  storage = new _utils__WEBPACK_IMPORTED_MODULE_0__["default"]();

  constructor(loginFields) {
    this.form = document.getElementById(loginFields.formId);
    this.emailInput = document.getElementById(loginFields.emailId);
    this.passwordInput = document.getElementById(loginFields.passwordId);
    this.registerSubmitBtn = document.getElementById(loginFields.submtBtn);
  }

  validateEmail(name, element, value) {
    let message, isValid;

    if (value === "") {
      message = "El email no puede estar vacío";
      isValid = false;
    }

    if (value !== "") {
      const regex =
        /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      isValid = regex.test(value);
      message = isValid ? "" : "El email no es válido";
    }

    if (isValid) {
      delete this.errors[name];
      element.classList.remove("is-invalid");
      document.getElementById(`${element.id}_error`).innerHTML = "";
      this.fields[name].value = value;
      return;
    } else {
      this.fields[name].value = "";
    }

    this.errors[name] = {
      element: element,
      message,
    };
  }

  validatePassword(name, element, value) {
    const isValid = value !== "";
    const message = isValid ? "" : "El password no puede estar vacío";

    if (isValid) {
      delete this.errors[name];
      element.classList.remove("is-invalid");
      document.getElementById(`${element.id}_error`).innerHTML = "";
      this.fields[name].value = value;
      return;
    } else {
      this.fields[name].value = "";
    }

    this.errors[name] = {
      element: element,
      message,
    };
  }

  registerLoginFields() {
    const requiredFields = [
      {
        name: "emailInput",
        element: this.emailInput,
        validate: this.validateEmail.bind(this),
      },
      {
        name: "passwordInput",
        element: this.passwordInput,
        validate: this.validatePassword.bind(this),
      },
    ];
    requiredFields.forEach((field) => {
      this.fields[field.name] = {
        name: field.name,
        validate: field.validate,
        element: field.element,
        value: "",
      };
    });
  }

  assignListeners() {
    this.form.addEventListener("submit", this.send.bind(this));
  }

  init() {
    this.redirectToRooms();
    this.registerLoginFields();
    this.assignListeners();
  }

  loginUser(data) {
    const allUSers = this.storage.getLocalStorage("users");
    const newUser = data;
    const user = allUSers?.find((user) => user.email === newUser.email);
    if (!user) {
      this.showErrorMessage("No existe nadie con este email");
      return;
    }
    const passWordIsValid = allUSers.find(
      (user) => user.password === newUser.password
    );
    if (!passWordIsValid) {
      this.showErrorMessage("La contraseña no es válida");
      return;
    }

    // Aqui va la lógica para poner al "user" (línea 95) dentro de los usuarios conectados
    this.storage.setLocalStorage("me", user, "session");

    //!Temporal
    const connectedUsers = this.storage.getLocalStorage("connectedUsers");
    if (!connectedUsers) {
      this.storage.setLocalStorage("connectedUsers", [user]);
    } else {
      const existConnectedUser = connectedUsers.find(
        (connectedUser) => connectedUser.id === user.id
      );
      if (!existConnectedUser) {
        connectedUsers.push(user);
        this.storage.setLocalStorage("connectedUsers", connectedUsers);
      }
    }

    // También se tiene que redirigir al usuario a la ruta /rooms
    window.location.href = "/rooms";
  }

  showErrorMessage(message) {
    const messageElement = document.getElementById("errorMessage");
    messageElement.innerHTML = message;
    messageElement.classList.remove("d-none");
  }

  redirectToRooms() {
    let user = this.storage.getLocalStorage("me", "session");
    if (user) {
      window.location.href = "/rooms";
    }
  }

  send(e) {
    e.preventDefault();
    const fields = this.fields;

    const errorMessageElement = document.getElementById("errorMessage");
    errorMessageElement.classList.add("d-none");

    Object.keys(fields).forEach((field) => {
      this.fields[field].validate(
        fields[field].name,
        fields[field].element,
        fields[field].element.value
      );
    });

    const existErrors = Object.keys(this.errors).length !== 0;

    if (existErrors) {
      Object.keys(this.errors).forEach((error) => {
        const inputElement = this.errors[error].element;
        const msgErrorElement = `${inputElement.id}_error`;
        inputElement.classList.add("is-invalid");
        document.getElementById(msgErrorElement).innerHTML =
          this.errors[error].message;
      });
      return;
    }

    const data = {
      email: this.fields.emailInput.value,
      password: this.fields.passwordInput.value,
    };

    // Método para enviar la información al localStorage, al apartado de usuaros conectados
    this.loginUser(data);
  }
}

/* harmony default export */ __webpack_exports__["default"] = (Login);


/***/ }),

/***/ "./src/js/Register.js":
/*!****************************!*\
  !*** ./src/js/Register.js ***!
  \****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/js/utils.js");
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! uuid */ "./node_modules/uuid/dist/esm-browser/v4.js");



class Register {
  fields = {};
  errors = {};
  local = new _utils__WEBPACK_IMPORTED_MODULE_0__["default"]();

  constructor(registerFields) {
    this.form = document.getElementById(registerFields.formId);
    this.nameInput = document.getElementById(registerFields.nameId);
    this.emailInput = document.getElementById(registerFields.emailId);
    this.passwordInput = document.getElementById(registerFields.passwordId);
    this.favouriteRoom = document.getElementById(
      registerFields.favouriteRoomId
    );
    this.avatarWrapper = document.getElementById(
      registerFields.avatarWrapperId
    );
    this.registerSubmitBtn = document.getElementById(registerFields.submtBtn);
  }

  onSelectAvatar(e) {
    const avatarId = e.target.id;
    const avatarDiv = document.getElementById(avatarId);
    this.selectAvatar(avatarDiv);
  }

  selectAvatar(selected) {
    const avatars = this.avatarWrapper.querySelectorAll(".a-avatar");
    avatars.forEach((avatar) => {
      avatar.classList.remove("active");
    });

    selected.classList.add("active");
  }

  assignListeners() {
    const avatars = this.avatarWrapper.querySelectorAll(".a-avatar");
    avatars.forEach((avatar) => {
      avatar.addEventListener("click", this.onSelectAvatar.bind(this));
    });

    this.form.addEventListener("submit", this.send.bind(this));
  }

  resetForm() {
    for (let field in this.fields) {
      const fieldEl = this.fields[field];
      fieldEl.value = "";
      if (fieldEl.name === "favouriteRoom") {
        fieldEl.element.value = "0";
      } else {
        fieldEl.element.value = "";
      }
    }

    const defaultAvatar = document.getElementById("avatar1");
    this.selectAvatar(defaultAvatar);
  }

  validateName(name, element, value) {
    const isValid = value !== "";
    const message = isValid ? "" : "El nombre no puede estar vacío";

    if (isValid) {
      delete this.errors[name];
      element.classList.remove("is-invalid");
      document.getElementById(`${element.id}_error`).innerHTML = "";
      this.fields[name].value = value;
      return;
    } else {
      this.fields[name].value = "";
    }

    this.errors[name] = {
      element: element,
      message,
    };
  }

  validateEmail(name, element, value) {
    let message, isValid;

    if (value === "") {
      message = "El email no puede estar vacío";
      isValid = false;
    }

    if (value !== "") {
      const regex =
        /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      isValid = regex.test(value);
      message = isValid ? "" : "El email no es válido";
    }

    if (isValid) {
      delete this.errors[name];
      element.classList.remove("is-invalid");
      document.getElementById(`${element.id}_error`).innerHTML = "";
      this.fields[name].value = value;
      return;
    } else {
      this.fields[name].value = "";
    }

    this.errors[name] = {
      element: element,
      message,
    };
  }

  validatePassword(name, element, value) {
    const isValid = value !== "";
    const message = isValid ? "" : "El password no puede estar vacío";

    if (isValid) {
      delete this.errors[name];
      element.classList.remove("is-invalid");
      document.getElementById(`${element.id}_error`).innerHTML = "";
      this.fields[name].value = value;
      return;
    } else {
      this.fields[name].value = "";
    }

    this.errors[name] = {
      element: element,
      message,
    };
  }

  validateFavouriteRoom(name, element, value) {
    const isValid = value !== "0";
    const message = isValid ? "" : "Debes seleccionar una sala";

    if (isValid) {
      delete this.errors[name];
      element.classList.remove("is-invalid");
      document.getElementById(`${element.id}_error`).innerHTML = "";
      this.fields[name].value = value;
      return;
    } else {
      this.fields[name].value = "";
    }

    this.errors[name] = {
      element: element,
      message,
    };
  }

  registerFields() {
    const requiredFields = [
      {
        name: "nameInput",
        element: this.nameInput,
        validate: this.validateName.bind(this),
      },
      {
        name: "emailInput",
        element: this.emailInput,
        validate: this.validateEmail.bind(this),
      },
      {
        name: "passwordInput",
        element: this.passwordInput,
        validate: this.validatePassword.bind(this),
      },
      {
        name: "favouriteRoom",
        element: this.favouriteRoom,
        validate: this.validateFavouriteRoom.bind(this),
      },
    ];
    requiredFields.forEach((field) => {
      this.fields[field.name] = {
        name: field.name,
        validate: field.validate,
        element: field.element,
        value: "",
      };
    });
  }

  init() {
    this.redirectToRooms();
    this.assignListeners();
    this.registerFields();
  }

  saveUser(data) {
    const allUSers = this.local.getLocalStorage("users");
    const newUser = data;

    if (!allUSers || allUSers.length === 0) {
      this.local.setLocalStorage("users", [newUser]);
      this.resetForm();
      this.showSuccesMessage();
      return;
    }

    const existUSer = allUSers.find((user) => user.email === newUser.email);
    if (existUSer) {
      this.showErrorMessage("Ya existe un usuario con este email");
      return;
    }

    allUSers.push(newUser);
    this.local.setLocalStorage("users", allUSers);
    this.resetForm();
    this.showSuccesMessage();
  }

  showErrorMessage(message) {
    const messageElement = document.getElementById("errorMessage");
    messageElement.innerHTML = message;
    messageElement.classList.remove("d-none");
  }

  showSuccesMessage() {
    const message = "Tu usuario se ha registrado correctamente.";
    const messageElement = document.getElementById("successMessage");
    const loginButton = document.getElementById("successButton");
    const submitButton = document.getElementById("submitButton");
    messageElement.innerHTML = message;
    messageElement.classList.remove("d-none");
    loginButton.classList.remove("d-none");
    submitButton.classList.add("d-none");

    setTimeout(() => {
      messageElement.classList.add("d-none");
      submitButton.classList.remove("d-none");
    }, 2000);
  }

  send(e) {
    e.preventDefault();
    const fields = this.fields;

    const errorMessageElement = document.getElementById("errorMessage");
    errorMessageElement.classList.add("d-none");

    Object.keys(fields).forEach((field) => {
      this.fields[field].validate(
        fields[field].name,
        fields[field].element,
        fields[field].element.value
      );
    });

    const existErrors = Object.keys(this.errors).length !== 0;

    if (existErrors) {
      Object.keys(this.errors).forEach((error) => {
        const inputElement = this.errors[error].element;
        const msgErrorElement = `${inputElement.id}_error`;
        inputElement.classList.add("is-invalid");
        document.getElementById(msgErrorElement).innerHTML =
          this.errors[error].message;
      });
      return;
    }

    const data = {
      id: (0,uuid__WEBPACK_IMPORTED_MODULE_1__["default"])(),
      name: this.fields.nameInput.value,
      email: this.fields.emailInput.value,
      password: this.fields.passwordInput.value,
      avatar: `mod${this.avatarWrapper.querySelector(".active").dataset.mod}`,
      favouriteRoom: this.fields.favouriteRoom.value,
      color: `mod${this.avatarWrapper.querySelector(".active").dataset.mod}`,
    };

    // Evento para enviar la información al localStorage, al apartado de usuaros registrados
    this.saveUser(data);
  }

  redirectToRooms(){
    let user = this.local.getLocalStorage("me", "session");
    if(user){
      window.location.href = "/rooms";
    }
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
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "./src/js/constants.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./src/js/utils.js");
/* harmony import */ var _Game__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Game */ "./src/js/Game.js");



class Room {
  capacity = 4;
  isOpen = true;
  players = [];
  roomBox = "";
  game = "";
  storage = new _utils__WEBPACK_IMPORTED_MODULE_1__["default"]();
  playButtonDiv = document.getElementById("playButton");

  constructor(id, name, capacity) {
    this.id = id;
    this.name = name;
    this.capacity = capacity;
  }

  onDraggPlayer(user) {
    if (this.players.length === this.capacity) {
      this.isOpen = false;
      disableRoom(this.id);
      console.log("sala llena!");
      return;
    }

    if (this.players.length > this.capacity || !this.isOpen) {
      console.log("La sala no acepta más jugadores");
      return;
    }

    this.addToRoom(user);
  }

  addToRoom(user) {
    // Creamos jugador que recoge los datos del usuario arrastrado
    const draggedPlayer = {
      name: user.name,
      avatar: user.avatar,
      id: user.id,
    };

    const rooms = this.storage.getLocalStorage("roomsList").rooms;
    const currentRoom = rooms.find((room) => room.id === this.id);
    const restUsers = currentRoom.usersRoom.filter(
      (userRoom) => userRoom.id !== draggedPlayer.id
    );

    // Si no existen usuarios en la sala
    if (currentRoom.usersRoom.length === 0) {
      currentRoom.usersRoom.push(draggedPlayer);
      this.updatePlayers(currentRoom.usersRoom);
    } else {
      // Si no existe el usuario y ya hay usuarios en la sala
      currentRoom.usersRoom = [...restUsers, draggedPlayer];
      this.updatePlayers(currentRoom.usersRoom);
    }

    // Añadimos players a la room
    this.players = currentRoom.usersRoom;

    // Añadimos rooms actualizado al localStorage
    const updateRooms = rooms.map((room) => {
      if (room.id === this.id) {
        room.usersRoom = currentRoom.usersRoom;
      }
      return room;
    });
    const updateRoomsList = {
      eventType: _constants__WEBPACK_IMPORTED_MODULE_0__.EVENT_TYPES.ADD_USER_TO_ROOM,
      roomEventId: this.id,
      rooms: updateRooms,
    };

    this.storage.setLocalStorage("roomsList", updateRoomsList);

    // Mostramos panel superior sala
    const gameTopPannelDiv = document.getElementById("gameTopPannel");
    gameTopPannelDiv.classList.remove("d-none");
    setTimeout(() => gameTopPannelDiv.classList.add("has-players"), 1000);
    gameTopPannelDiv.querySelector(
      ".m-game__title strong"
    ).innerHTML = `${this.name}`;
  }

  updatePlayers(usersRoom) {
    const roomBoxDiv = document.getElementById(this.id);
    roomBoxDiv.querySelector(".m-room-drop-item__total span").innerHTML =
      usersRoom.length;

    // Actualizamos listado de los usarios conectados en el tablero
    const listConnectedUSers = document.querySelector(
      "#roomConnectedMessage ul"
    );
    const connectedUsers = usersRoom.map((user) => `<li>${user.name}</li>`);
    listConnectedUSers.innerHTML = connectedUsers.join("");

    // Mostrar posibilidad de empezar a jugar
    if (usersRoom.length > 1) {
      this.renderPlayBtn();
    }
  }

  showRoomMessage(type, user) {
    let message;
    const messageDiv = document.querySelector("#roomMessage");
    switch (type) {
      case _constants__WEBPACK_IMPORTED_MODULE_0__.MESSAGE_TYPES.CONNECTED_TO_ROOM:
        message = `El usuario ${user.name} se ha conectado a esta sala`;
        break;
      default:
        return "";
    }

    const messageContentDiv = `<div class="alert alert-info alert-dismissible fade show" role="alert">
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                <span id="roomMessageContent">${message}</span>
              </div>`;
    messageDiv.innerHTML = messageContentDiv;
  }

  disableRoom(id) {
    const roomDivElement = document.getElementById(id);
    roomDivElement.classList.add("isFull");

    // quitamos mensaje conectados del panel de juego
    document.getElementById("roomConnectedMessage").innerHTML = "";
  }

  takeOutFromRoom(player){
      let is_in = this.players.find((room_player)=> room_player.id === player.id);
      if(!!is_in){
        this.game.takeOutFromGame(player);
        //this.players = this.players.filter((room_player)=> room_player.id !== player.id);
      }
  }

  initStorageEvents() {
    window.addEventListener("storage", (e) => {
      // por cada sala se lanza este evento
      if (e.key === "roomsList") {
        const roomsList = JSON.parse(e.newValue);

        switch (roomsList.eventType) {
          case _constants__WEBPACK_IMPORTED_MODULE_0__.EVENT_TYPES.ADD_USER_TO_ROOM:
            this.handleEventAddUser(roomsList);
            break;
          case _constants__WEBPACK_IMPORTED_MODULE_0__.EVENT_TYPES.PLAY_GAME:
            this.handleEventPlayGame(roomsList);
            break;
          default:
            return;
        }
      }
    });
  }

  handleEventAddUser(roomsList) {
    // Si la sala no es la que tiene el evento no hacemos nada
    if (roomsList.roomEventId !== this.id) return;

    const currentEventRoom = roomsList.rooms.find(
      (room) => room.id === roomsList.roomEventId
    );

    // Actualizamos la información relacionada con el comienzo del juego en los otros jugadores
    // caja de sala, mensaje de usuarios conectados en la sala
    this.updatePlayers(currentEventRoom.usersRoom);
  }

  handleEventPlayGame(roomsList) {
    // Si la sala no es la que tiene el evento no hacemos nada
    if (roomsList.roomEventId !== this.id) return;
    const currentRoom = roomsList.rooms.find(
      (room) => room.id === roomsList.roomEventId
    );
    this.initGame(currentRoom.usersRoom, true);
  }

  renderPlayBtn() {
    this.playButtonDiv.innerHTML = `<button class="btn btn-primary btn-lg btn-rounded px-4" type="button">Empezar a jugar!</button>`;
    this.playButtonDiv.addEventListener("click", this.playGame.bind(this));
  }

  playGame() {
    const rooms = this.storage.getLocalStorage("roomsList").rooms;
    const updateRoomsStorage = rooms.map((room) => {
      if (room.id === this.id) {
        room.isOpen = false;
      }
      return room;
    });

    this.storage.setLocalStorage("roomsList", {
      eventType: _constants__WEBPACK_IMPORTED_MODULE_0__.EVENT_TYPES.PLAY_GAME,
      roomEventId: this.id,
      rooms: updateRoomsStorage,
    });

    const currentRoom = rooms.find((room) => room.id === this.id);
    this.initGame(currentRoom.usersRoom);
  }

  prepareGame() {
    // Quitamos botón de play
    this.playButtonDiv.innerHTML = "";

    // seteamos la room a close
    this.isOpen = false;

    // deshabilitamos sala
    this.disableRoom(this.id);
  }

  initGame(players, isCallWithEvent = false) {
    this.prepareGame(players);
    // Inicializamos juego
    const gridSize = 20;
    const currentPlayerInfo = this.storage.getLocalStorage("me", "session");
    this.game = new _Game__WEBPACK_IMPORTED_MODULE_2__["default"](this.id, currentPlayerInfo, players, gridSize);
    this.game.init(isCallWithEvent);
  }
}

/* harmony default export */ __webpack_exports__["default"] = (Room);


/***/ }),

/***/ "./src/js/constants.js":
/*!*****************************!*\
  !*** ./src/js/constants.js ***!
  \*****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MESSAGE_TYPES": function() { return /* binding */ MESSAGE_TYPES; },
/* harmony export */   "EVENT_TYPES": function() { return /* binding */ EVENT_TYPES; }
/* harmony export */ });
const MESSAGE_TYPES = {
  CONNECTED_TO_ROOM: "CONNECTED_TO_ROOM",
  DISCONNECTED_FROM_ROOM: "DISCONNECTED_FROM_ROOM",
  WAITTING_TURN: "WAITTING_TURN",
  HAS_LOST: "HAS_LOST",
};

const EVENT_TYPES = {
  ADD_USER_TO_ROOM: "ADD_USER_TO_ROOM",
  PLAY_GAME: "PLAY_GAME",
  UPDATE_GAME: "UPDATE_GAME",
  SOMEONE_HAS_LOST: "SOMEONE_HAS_LOST",
};


/***/ }),

/***/ "./src/js/utils.js":
/*!*************************!*\
  !*** ./src/js/utils.js ***!
  \*************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ LocalStorage; },
/* harmony export */   "getNewGameInfo": function() { return /* binding */ getNewGameInfo; }
/* harmony export */ });
class LocalStorage {
  localStorage = window.localStorage;
  sessionStorage = window.sessionStorage;

  setLocalStorage(key, data, type) {
    const dataToLocaltorage = JSON.stringify(data);
    if (type === "session") {
      this.sessionStorage.setItem(key, dataToLocaltorage);
    } else {
      this.localStorage.setItem(key, dataToLocaltorage);
    }
  }

  getLocalStorage(key, type) {
    let data;

    if (type === "session") {
      data = this.sessionStorage.getItem(key);
    } else {
      data = this.localStorage.getItem(key);
    }

    return JSON.parse(data);
  }
}

const getNewGameInfo = (context) => {
  return {
    defeatedPlayers: context.defeatedPlayers,
    grid: context.grid,
    players: context.players,
    round: context.round,
    totalCellsToWin: context.totalCellsToWin,
  };
};


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
/* harmony export */   "Room": function() { return /* reexport safe */ _Room__WEBPACK_IMPORTED_MODULE_1__["default"]; },
/* harmony export */   "Dashboard": function() { return /* reexport safe */ _DashBoard__WEBPACK_IMPORTED_MODULE_2__["default"]; },
/* harmony export */   "Register": function() { return /* reexport safe */ _Register__WEBPACK_IMPORTED_MODULE_3__["default"]; },
/* harmony export */   "Login": function() { return /* reexport safe */ _Login__WEBPACK_IMPORTED_MODULE_4__["default"]; }
/* harmony export */ });
/* harmony import */ var _Game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Game */ "./src/js/Game.js");
/* harmony import */ var _Room__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Room */ "./src/js/Room.js");
/* harmony import */ var _DashBoard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DashBoard */ "./src/js/DashBoard.js");
/* harmony import */ var _Register__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Register */ "./src/js/Register.js");
/* harmony import */ var _Login__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Login */ "./src/js/Login.js");








}();
Conquer = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=bundle.js.map