class Game
{
  colors = [ 'Purple', 'Aquamarine', 'CadetBlue', 'DeepPink' ];
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
    if(this.totalCellsToWin === currentPlayerTurn.cellsConquered){
      console.log(`El jugador ${currentPlayerTurn.name} ha ganado!!!`);
    }

    if(this.players.length == 1){
      console.log(`El jugador ${this.players[0].name} ha ganado!!!`);
    }

    // cambiamos el turno
    this.checkTurn()
  }

  checkOtherPlayerLoss(currentPlayerId){
      let otherPlayers = this.players.filter((o)=> o.id !== currentPlayerId);
      let defeated = [];
      otherPlayers.forEach((player) => {
        let aux = true;
          let conqueredCells = this.grid.filter((c)=> c.playerId == player.id);

          if(conqueredCells.length > 0){
            conqueredCells.forEach((cellObj)=>{
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
          this.defeatPlayer(player);
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

  defeatPlayer(player){
    this.defeatedPlayers.push(player);
    this.players = this.players.filter(oplayer => oplayer.id !== player.id);
    console.log(`El jugador ${player.name} ha perdido!!!`);
  }

  takeOutFromGame(player){
    let is_in = this.players.find(current_player => current_player.id === player.id);
    if(!!is_in){
      this.defeatPlayer(player);
    }
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

export default Game;