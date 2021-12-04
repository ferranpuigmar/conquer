import { EVENT_TYPES, MESSAGE_TYPES } from "./constants";
import LocalStorage, { getNewGameInfo } from "./utils";

class Game {
  colors = ["Purple", "Aquamarine", "CadetBlue", "DeepPink"];
  grid = [];
  defeatedPlayers = [];
  wrapper = document.getElementById("grid");
  totalCellsToWin = 0;
  storage = new LocalStorage();
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
      case MESSAGE_TYPES.WAITTING_TURN:
        message = `Es el turno de  ${this.round.player.name}, espera a que haga su movimiento`;
        break;
      case MESSAGE_TYPES.HAS_LOST:
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
      this.showRoomMessage(MESSAGE_TYPES.WAITTING_TURN);
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

    const newGameToStorage = getNewGameInfo(this);

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
        const newGameToStorage = getNewGameInfo(this);
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
      eventType: EVENT_TYPES.SOMEONE_HAS_LOST,
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
      this.showRoomMessage(MESSAGE_TYPES.WAITTING_TURN);
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
      eventType: EVENT_TYPES.UPDATE_GAME,
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
          case EVENT_TYPES.UPDATE_GAME:
            !this.player.hasLost && this.handleUpdateEventGame(roomsList);
            break;
          case EVENT_TYPES.SOMEONE_HAS_LOST:
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
      this.showRoomMessage(MESSAGE_TYPES.HAS_LOST);
      this.player.hasLost = true;
      this.createLegend(currentRoom.game.players);
    }
  }
}

export default Game;
