import React from 'react';
import './Board.css'

class Board extends React.Component {
  constructor() {
    super()
    this.fromPoint = null;
    this.to = null;
  }
  onClick(id) {
    if (!this.fromPoint) {
      this.fromPoint = id
    } else {
      this.props.moves.clickCell(this.fromPoint, id)
      this.fromPoint = null
      this.props.events.endTurn();
    }
  }

  // isActive(id) {
  //   if (!this.props.isActive) return false;
  //   // TODO: Improve
  //   if (this.props.G.cells[id] === 0 || this.props.G.cells[id] === 1) return false;
  //   return true;
  // }

  render() {
    let winner = '';
    let lastPlayed = '';
    // if (this.props.ctx.gameover) {
    //   winner =
    //     this.props.ctx.gameover.winner !== undefined ? (
    //       <div id="winner">Winner: {this.props.ctx.gameover.winner === "0" ? "Red" : "Black"}
    //       {this.props.ctx.gameover.stalemate !== undefined ? <span> by stalemate</span> : "" }
    //       </div>
    //     ) : (
    //       <div id="winner">Draw!</div>
    //     );
    // }

    // if (this.props.G.lastPlayed) {
    //   lastPlayed = <div>
    //     <p>Last Played Tile: </p>
    //     <table class="board">
    //     <tr>
    //       {Tile(this.props.G.lastPlayed)}
    //     </tr>
    //     </table>
    //     </div>
    // }

    function Tile(val, interactive=false, id=null, ctx=null) {
      // const suitLookup = function(val) {
      //   const SUITS = ['♠','♥','♦','♣'];
      //   let index = parseInt(val[1], 10) - 1;
      //   return SUITS[index];
      // }
      let text = '';
      if (val === -1 ) {
        text = " "
      } else if (val == 0) {
        text = "X"
      } else if (val == 1) {
        text = "O"
      } else {
        text = "?"
      }

      if(interactive) {
        return <td data-tile={val} key={id} onClick={() => ctx.onClick(id)}>
            {text}
          </td>
      }
      else {
        return <td data-tile={val}>
            {text}
          </td>
      }
    }


    let tbody = [];
    for (let i = 0; i < 5; i++) {
      let grid = [];
      for (let j = 0; j < 5; j++) {
        const id = 5 * i + j;
        let interactive = (i === 0 || i ===4 ) || (j === 0 || j === 4)
        grid.push(Tile(this.props.G.grid[id], interactive, id, this));
      }
      tbody.push(<tr key={i}>{grid}</tr>);
    }

    return (
      <div>
        <table class="board">
          <tbody>{tbody}</tbody>
        </table>
        // {winner}
        // {lastPlayed}
      </div>
    );
  }
}

export default Board;
