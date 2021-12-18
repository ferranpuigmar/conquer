import { MESSAGE_TYPES } from "./constants";
const { createGame } = require("../../services/games.js");
import LocalStorage, { getNewGameInfo } from "./utils";

class Game {
  colors = ["Purple", "Aquamarine", "CadetBlue", "DeepPink"];
  grid = [];
  defeatedPlayers = [];
  totalCellsToWin = 0;
  storage = new LocalStorage();
  roomsList;
  canvas = document.getElementById("game");
  cells = [];
  eventCheckFillCellHandler = this.checkFillCell.bind(this);
  wrapper = document.getElementById("grid");
  waittingDiv = document.querySelector("#roomMessage"); // Div del mensaje de espera
  roundTitle = document.getElementById("roundTitle"); // Número del Round
  pannelInfo = document.getElementById("roomPannelInfo");
  gameInfo = document.querySelector('.m-game__info');
  cellsToWinInfo = document.getElementById("cellsToWinInfo");
  conqueredCellsInfo = document.getElementById("conqueredCellsInfo");

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

  calculateNewRoundInfo() {
    const newTurn = this.round.turn + 1;
    const isTurnEnd = newTurn > this.players.length;
    const newRoundTitle = isTurnEnd
      ? this.round.roundNumber + 1
      : this.round.roundNumber;

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
      case MESSAGE_TYPES.HAS_WON:
        message = `Fin de la partida. El jugador ${this.players[0].name} ha ganado.`;
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
    if (this.players.length == 1) {
      this.showRoomMessage(MESSAGE_TYPES.HAS_WON);
      return;
    } else {
      this.hideRoomMessage();
    }

    if (this.round.player.id !== this.player.id) {
      this.showRoomMessage(MESSAGE_TYPES.WAITTING_TURN);
    } else {
      this.hideRoomMessage();
    }

    console.log("hola...");

    this.roundTitle.querySelector("span").innerHTML = game.round.roundNumber;
    this.conqueredCellsInfo.innerHTML = this.players.find(
      (player) => player.id === this.player.id
    ).cellsConquered;
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
    if (!this.isMyTurn(this.round)) return;

    const currentPlayerTurn = this.round.player;

    let currentCell;
    let gridIndex;
    for (let i = 0; i < this.cells.length; i++) {
      let cellPath = this.cells[i];
      if (this.context.isPointInPath(cellPath, e.offsetX, e.offsetY)) {
        currentCell = this.grid[i];
        gridIndex = i;
        break;
      }
    }

    if (currentCell.playerId !== null) return;

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
    this.round = this.calculateNewRoundInfo();

    const updateGameToStorage = {
      defeatedPlayers: this.defeatedPlayers,
      grid: this.grid,
      players: this.players,
      round: this.round,
      totalCellsToWin: this.totalCellsToWin,
    };

    this.checkTurn(updateGameToStorage);
    this.updateGame(updateGameToStorage);
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

    if (defeated.length > 0) {
      defeated.forEach((player) => {
        this.defeatedPlayers.push(player);
        this.players = this.players.filter(
          (oplayer) => oplayer.id !== player.id
        );
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

    this.grid[index] = {
      ...this.grid[index],
      playerId: this.round.player.id,
      color: this.round.player.color,
    };
  }

  defeatPlayer(player) {
    this.defeatedPlayers.push(player);
    this.players = this.players.filter((oplayer) => oplayer.id !== player.id);
  }

  // takeOutFromGame(player) {
  //   let is_in = this.players.find(
  //     (current_player) => current_player.id === player.id
  //   );
  //   if (!!is_in) {
  //     this.defeatPlayer(player);
  //     this.calculateTotalCellsToWin(this.totalCells, this.players);
  //   }
  // }

  generateCanvas() {
    this.clearCanvas();

    let colCounter = 0;
    let rowCounter = 0;

    for (let cell = 0; cell < this.totalCells; cell++) {
      if (cell !== 0 && cell % this.gridSize === 0) {
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

    this.canvas.addEventListener("click", this.eventCheckFillCellHandler);
  }

  clearCanvas() {
    this.canvas.removeEventListener("click", this.eventCheckFillCellHandler);
    this.context = this.canvas.getContext("2d");
    this.context.clearRect(0, 0, 1000, 1000);
    this.context.beginPath();
    this.cells = [];
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    this.cellWidth = this.canvas.width / this.gridSize;
    this.cellHeight = this.canvas.height / this.gridSize;
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

  generateGrid(gridSize) {
    return [...Array(gridSize * gridSize)];
  }

  userToPlayerDTO(players) {
    return players.map((player, index) => ({
      id: player.id,
      name: player.name,
      cellsConquered: 0,
      color: this.colors[index],
      hasLost: false,
    }));
  }

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

  notifySomeoneHasLost(newGameInfo) {
    const roomListUpdate = {
      roomEventId: this.roomId,
      newGameInfo,
    };

    this.socket.emit("updatePlayerLost", roomListUpdate);
  }

  async init(isCallWithEvent) {
    this.generateCanvas();
    this.initCanvasEvents();
    this.calculateTotalCellsToWin(this.totalCells, this.players);
    this.initSocketsEvents();
    this.roundTitle.querySelector("span").innerHTML = 1;
    this.roundTitle.classList.remove("d-none");
    this.createLegend();

    if (!this.isMyTurn(this.round)) {
      this.showRoomMessage(MESSAGE_TYPES.WAITTING_TURN);
    }

    const initNewGameToStorage = {
      grid: this.grid,
      players: this.players,
      defeatedPlayers: this.defeatedPlayers,
      totalCellsToWin: this.totalCellsToWin,
      round: this.round,
    };

    if (isCallWithEvent) {
      await createGame({ roomId: this.roomId, initNewGameToStorage });
    }
    this.gameInfo.classList.remove('d-none');
    this.cellsToWinInfo.innerHTML = this.totalCellsToWin;
  }

  updateGame(newGameInfo) {
    const roomListUpdate = {
      roomId: this.roomId,
      newGameInfo,
    };

    this.socket.emit("updateGame", roomListUpdate);
  }

  initSocketsEvents() {
    this.socket.on("notifyUpdateGame", (game, roomId) => {
      if (this.roomId === roomId) {
        this.handleUpdateEventGame(game);
      }
    });
    this.socket.on("notifySomeoneLost", (data) => {
      !this.player.hasLost && this.handleSomeoneHasLostEvent(roomsList);
    });
  }

  handleUpdateEventGame(game) {
    this.grid = game.grid;
    this.round = game.round;
    this.totalCellsToWin = game.totalCellsToWin;
    this.defeatedPlayers = game.defeatedPlayers;
    this.players = game.players;
    this.generateCanvas();
    this.checkTurn(game);
  }

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
