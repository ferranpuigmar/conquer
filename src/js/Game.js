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

export default Game;