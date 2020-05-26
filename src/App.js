import { INVALID_MOVE } from "boardgame.io/core";
import _ from "lodash";

// Our game state is a 1d array of size 25
const WINNING_TILES = [
  // Every row
  [0,  1,  2,  3,  4],
  [5,  6,  7,  8,  9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],

  // Every column],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23],
  [4, 9, 14, 19, 24],

  // // top-left to bottom-right diagonal
  [0,6,12,18,24],
  // // bottom-left to top-right diagonal
  [20,16,12,8,4]
];

const ZERO = 0;
const FIVE = 5;
const FOUR = 4;
const EDGES = [0, 1, 2, 3, 4, 9, 14, 19, 24, 23, 22, 21, 20, 15, 10, 5];

const Quixo = {
  IsVictory: function(grid, playerIndex) {
    let DidIWin = false;
    let DidYouWin = false;
    playerIndex = parseInt(playerIndex, 10);
    let otherPlayer = !(playerIndex)

    const isSetComplete = (row) => {
      const symbols = row.map((i) => grid[i]);
      return symbols.every((i) => i !== null && i === symbols[0]);
    };

    for(let tileSet of WINNING_TILES) {
      let values = grid.filter((val, index) => {
        return (tileSet.indexOf(index) > -1)
      })

      DidIWin = DidIWin || values.every((x)=>x==playerIndex)
      DidYouWin = DidYouWin || values.every((x)=>x==otherPlayer)
    }
    // The player to make a line with his/her opponent’s symbol loses the game, even if he/she makes a line with his/her own symbol at the same time
    return DidIWin && (!DidYouWin)
  },
  toRowColumn: function(i) {
    return [Math.floor(i / FIVE), i % FIVE];
  },
  toGrid: function(r, c) {
    return FIVE * r + c;
  },
  movePieces: function(grid, from, to, player) {
    let [fromRow, fromColumn] = Quixo.toRowColumn(from);
    let [toRow, toColumn] = Quixo.toRowColumn(to);

    let RR = _.range(toRow, fromRow).concat([fromRow]);
    let CC = _.range(toColumn, fromColumn).concat([fromColumn]);

    let temp = parseInt(player, 10);
    for (let r of RR) {
      for (let c of CC) {
        let newPiece = grid[Quixo.toGrid(r, c)];
        let ii = Quixo.toGrid(r, c);
        grid[ii] = temp;
        temp = newPiece;
      }
    }
    return grid;
  },
  // Given a index from 0-24 of the removed piece
  // returns an array of valid positions it can re-enter the board
  // Assumes that only a border piece is passed here.
  validPositions: function(i) {
    let [row, column] = Quixo.toRowColumn(i);
    return [
      Quixo.toGrid(ZERO, column),
      Quixo.toGrid(FOUR, column),
      Quixo.toGrid(row, ZERO),
      Quixo.toGrid(row, FOUR),
    ].filter(function(item) {
      return item !== i;
    });
  },
  turn: {
    moveLimit: 1,
  },
  ai: {
    enumerate: (G, ctx) => {
      let moves = [];
      for(let fromPiece of EDGES) {
        // If the piece is blank or if the piece is ours
        if (G.grid[fromPiece] == ctx.currentPlayer || G.grid[fromPiece] == -1) {
          for(let wherePiece of Quixo.validPositions(fromPiece)) {
            moves.push({ move: "clickCell", args: [fromPiece, wherePiece] });
          }
        }
      }
      return moves;
    },
  },
  setup: (ctx) => ({
    // Initialized to -1 for all positions
    grid: Array(25).fill(-1)
  }),

  moves: {
    clickCell: (G, ctx, fromWhere, toWhere) => {
      let currentPiece = G.grid[fromWhere];

      // The player chooses and takes a blank cube, or one with his/her symbol on it,
      //  You are not allowed to take a cube bearing your opponent’s symbol.
      if (currentPiece != ctx.currentPlayer && currentPiece != -1) {
        return INVALID_MOVE;
      }

      let moves = Quixo.validPositions(fromWhere);

      if (moves !== INVALID_MOVE && moves.indexOf(toWhere) !== -1) {
        //  We move around the pieces here
        G.grid = Quixo.movePieces(
          G.grid,
          fromWhere,
          toWhere,
          ctx.currentPlayer
        );
      } else {
        return INVALID_MOVE;
      }
    },
  },

  endIf: (G, ctx) => {
    if (Quixo.IsVictory(G.grid, ctx.currentPlayer)) {
      return { winner: ctx.currentPlayer };
    }
  },
};
export default Quixo;
