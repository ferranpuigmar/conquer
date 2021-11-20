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
  canvas = document.getElementById("game");
  cells = [];

  constructor(roomId, playerInfo, players, socket, gameSize) {
    this.player = playerInfo;
    this.players = this.userToPlayerDTO(players);
    this.totalCells = gameSize * gameSize;
    this.round = { turn: 1, roundNumber: 1, player: this.players[0] };
    this.grid = this.generateGrid(gameSize);
    this.roomId = roomId;
    this.socket = socket;
    this.context = this.canvas.getContext("2d");
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    this.gridSize = gameSize;
    this.cellWidth = this.canvas.width / this.gridSize;
    this.cellHeight = this.canvas.height / this.gridSize;
  }

  initCanvasEvents() {
    new ResizeObserver(this.generateCanvas.bind(this)).observe(this.canvas);
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

  checkTurn(game) {
    if (this.round.player.id !== this.player.id) {
      this.showRoomMessage(MESSAGE_TYPES.WAITTING_TURN);
    } else {
      this.hideRoomMessage();
    }

    // Actualizamos juego para el jugador
    this.roundTitle.querySelector("span").innerHTML = game.round.roundNumber;

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

  checkValidCellClick(cellObj, id) {
    const row = Number(cellObj.row);
    const cell = Number(cellObj.cell);

    const nearCells = [
      `cell${row + 1}_${cell - 1}`, // bottom left
      `cell${row + 1}_${cell}`, // bottom
      `cell${row + 1}_${cell + 1}`, // bottom right
      `cell${row}_${cell - 1}`, // left
      `cell${row}_${cell + 1}`, // right
      `cell${row - 1}_${cell - 1}`, // top left
      `cell${row - 1}_${cell}`, // top
      `cell${row - 1}_${cell + 1}`, // top right
    ];

    const validClick = [];

    for (let i = 0; i < nearCells.length; i++) {
      const targetCell = this.grid.find((cell) => {
        return cell.id === nearCells[i];
      });
      if (targetCell && targetCell.playerId === id) {
        validClick.push({ validCell: true });
      }
    }
    return validClick.some((el) => el.validCell);
  }

  checkFillCell(e) {
    //!Temporal if (!this.isMyTurn(this.round)) return;

    const currentPlayerTurn = this.round.player;

    let currentCell;
    let gridIndex;
    for (let i = 0; i < this.cells.length; i++) {
      let cellPath = this.cells[i];
      if (this.context.isPointInPath(cellPath, e.offsetX, e.offsetY)) {
        console.log("cell " + i);
        currentCell = this.grid[i];
        gridIndex = i;
      }
    }

    const cellObj = {
      row: currentCell.row,
      cell: currentCell.cell,
    };

    if (this.round.roundNumber !== 1) {
      let isCellFilled, isAValidCellClick;
      isCellFilled = currentCell.playerId !== null;
      isAValidCellClick = this.checkValidCellClick(
        cellObj,
        currentPlayerTurn.id
      );

      if (isCellFilled || !isAValidCellClick) {
        return;
      }
    }

    this.fillCell(currentCell);
    this.addConqueredCell(currentPlayerTurn.id, gridIndex);

    this.checkOtherPlayerLoss(currentPlayerTurn.id);

    //!Temporal
    this.round.roundNumber++;
  }

  fillCell(cell, color) {
    this.context.beginPath();
    this.context.rect(
      cell.cell_x,
      cell.cell_y,
      this.cellWidth,
      this.cellHeight
    );
    this.context.strokeStyle = "#ccc";
    this.context.lineWidth = 1;
    this.context.fillStyle = color ?? this.round.player.color;
    this.context.fill();
    this.context.stroke();
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
          if (this.checkValidCellClick(cellObj, player.id)) {
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

  addConqueredCell(playerId, index) {
    this.players = this.players.map((player) => {
      if (player.id === playerId) {
        player.cellsConquered += 1;
      }
      return player;
    });

    // Actualizamos grid de referencia
    this.grid[index] = {
      ...this.grid[index],
      playerId: this.round.player.id,
      color: this.round.player.color,
    };
    console.log(this.grid);
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

  generateCanvas() {
    this.clearCanvas();
    console.log("generating canvas....");

    let colCounter = 0;
    let rowCounter = 0;

    for (let cell = 0; cell < this.totalCells; cell++) {
      if (cell !== 0 && cell % 20 === 0) {
        colCounter = 0;
        rowCounter++;
      }

      const path = new Path2D();
      this.context.strokeStyle = "#ccc";
      this.context.lineWidth = 1;
      this.context.rect(
        colCounter * this.cellWidth,
        rowCounter * this.cellHeight,
        this.cellWidth,
        this.cellHeight
      );
      this.context.stroke();

      const rowNum = rowCounter + 1;
      const cellNum = colCounter + 1;
      this.grid[cell] = {
        id: `cell${rowNum}_${cellNum}`,
        row: rowNum,
        cell: cellNum,
        cell_x: colCounter * this.cellWidth,
        cell_y: rowCounter * this.cellHeight,
        playerId: this.grid[cell]?.playerId ?? null,
        color: this.grid[cell]?.color ?? null,
      };

      if (this.grid[cell].playerId !== null) {
        this.fillCell(this.grid[cell], this.grid[cell].color);
      }

      path.rect(
        colCounter * this.cellWidth,
        rowCounter * this.cellHeight,
        this.cellWidth,
        this.cellHeight
      );
      this.cells.push(path);

      colCounter++;
    }
    console.log(this.grid);
  }

  clearCanvas() {
    this.context.clearRect(0, 0, 1000, 1000);
    this.context = this.canvas.getContext("2d");
    this.canvas.addEventListener("click", this.checkFillCell.bind(this));
    this.cells = [];
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
    const roomListUpdate = {
      roomEventId: this.roomId,
      newGameInfo
    };

    this.socket.emit("updatePlayerLost", roomListUpdate);
  }

  // Método que inicializa el juego
  init(isCallWithEvent) {
    this.generateCanvas();
    this.initCanvasEvents();
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

      this.updateGame(initNewGameToStorage);
    }
  }

  // Método que actualiza el localStorage del juego
  // y añade un evento del tipo update para que el listener del storage
  // reaccione en el resto de tabs de jugador
  updateGame(newGameInfo) {

    const roomListUpdate = {
      roomId: this.roomId,
      newGameInfo
    };

    this.socket.emit("game", roomListUpdate);
  }

  // Método que añade el evento storage al juego
  initStorageEvents() {

    this.socket.on("notifyUpdateGame", (room) => {
      console.log("update!!");
      this.handleUpdateEventGame(room);
    });
    // this.socket.on("notifySomeoneLost", (data) => {
    //     !this.player.hasLost && this.handleSomeoneHasLostEvent(roomsList);
    // });
  }

  // Recibe el evento update y cambia la info de los demás jugadores
  // que estan conectados a la partida y aún no es su turno
  handleUpdateEventGame(game) {
    console.log("update game from event");

    // Actualizamos grid de la clase
    this.grid = game.grid;
    this.round = game.round;
    this.totalCellsToWin = game.totalCellsToWin;
    this.players = game.players;

    // Chequeamos el turno del jugador
    this.checkTurn(game);
  }

  // Recibe el evento que alguien ha perdido y lo notifica a aquella id
  // de usuariso que corresponda
  handleSomeoneHasLostEvent(roomsList) {
    // // Si la sala no es la que tiene el evento no hacemos nada
    // if (roomsList.roomEventId !== this.roomId) return;

    // const currentRoom = roomsList.rooms.find(
    //   (room) => roomsList.roomEventId === room.id
    // );

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
