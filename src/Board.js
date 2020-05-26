import React from 'react';
import './Board.css'

class Board extends React.Component {
  constructor() {
    super()
    this.fromPoint = null;
    this.to = null;
    // Clickables are what is clickable _after you've picked a piece_
    this.clickables = [];
  }

  validPositions(i) {
    let [row, column] = [Math.floor(i/5), i % 5]
    let toGrid = function(x,y) { return x*5 + y}
    return [
      toGrid(0, column),
      toGrid(4, column),
      toGrid(row, 0),
      toGrid(row, 4),
    ].filter(function(item) {
      return item !== i;
    });
  }
  onClick(id) {
    if (this.props.ctx.gameover) {return}
    if (!this.fromPoint) {
      this.fromPoint = id
      this.clickables = this.validPositions(id)
    } else {
      this.props.moves.clickCell(this.fromPoint, id)
      this.fromPoint = null
      this.props.events.endTurn()
    }
    this.forceUpdate();
  }

  render() {
    let winner = false;
    let lastPlayed = '';
    if (this.props.ctx.gameover) {
      winner = <div id="winner">Winner: {this.props.ctx.gameover.winner === "0" ? "X" : "O"}</div>
    }

    let x_or_zero = this.props.ctx.currentPlayer == 0 ? "X" :  "O"

    if (this.props.ctx.currentPlayer) {
      lastPlayed = <div><p>Current Turn: {x_or_zero}</p></div>
    }

    function Tile(val, interactive=false, id=null, ctx=null) {
      let currentPlayer = ctx.props.ctx.currentPlayer
      let text = '';
      if (val == -1 ) {
        text = " "
      } else if (val == 0) {
        text = "X"
      } else if (val == 1) {
        text = "O"
      } else {
        text = "?"
      }

      // we haven't clicked the first piece yet
      if(ctx.fromPoint === null) {
        // If game has ended, everything is unclickable
        if (ctx.props.ctx.gameover) interactive = false
        if(interactive & (val == -1|| val == currentPlayer)) {
          return <td key={id} style={{backgroundColor:"white"}} data-tile={val} key={id} onClick={() => ctx.onClick(id)}>
              {text}
            </td>
        }
        else {
          return <td key={id} style={{backgroundColor:"#ecf0f1"}} data-tile={val}>
              {text}
            </td>
        }

      }
      // we have clicked fromPoint and only this.clickables are worthy of being interactive
      else {
        if (ctx.clickables.indexOf(id) > -1) {
         return <td style={{backgroundColor:"white"}} data-tile={val} key={id} onClick={() => ctx.onClick(id)}>
                      {text}
                    </td>
        } else {
          return <td style={{backgroundColor:"#ecf0f1"}} data-tile={val}>
              {text}
            </td>
        }
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
        {winner}
        {lastPlayed}
      </div>
    );
  }
}

export default Board;
