import { INVALID_MOVE } from "boardgame.io/core";
import _ from "lodash";

// Our game state is a 1d array of size 25
const WINNING_TILES = [
  // Every row
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],

  // Every column
  [0, 5, 10, 15, 20],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23],
  [4, 9, 15, 19, 24],
];

const ZERO = 0;
const FIVE = 5;
const FOUR = 4;

// const EDGES = [0, 1, 2, 3, 4, 9, 14, 19, 24, 23, 22, 21, 20, 15, 10, 5];

function IsVictory(grid, playerIndex) {
  const isRowComplete = (row) => {
    const symbols = row.map((i) => grid[i]);
    return symbols.every((i) => i !== null && i === symbols[0]);
  };

  return WINNING_TILES.map(isRowComplete).some((i) => i === playerIndex);
}

const Quixo = {
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
  // ai: {
  //   enumerate: (G, ctx) => {
  //     let moves = [];
  //     for (let i = 0; i < 16; i++) {
  //       if (unclaimed(G.cells[i]) && validMove(G.cells[i], i, G.lastPlayed)) {
  //         moves.push({ move: "clickCell", args: [i] });
  //       }
  //     }
  //     return moves;
  //   },
  // },
  setup: (ctx) => ({
    // Initialized to -1 for all positions
    grid: Array(25).fill(-1),
    lastPlayed: null,
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

  // endIf: (G, ctx) => {
  //   if (IsVictory(G.cells)) {
  //     return { winner: ctx.currentPlayer };
  //   }

  //   if (G.cells.filter(unclaimed).length === 0) {
  //     return { draw: true };
  //   }

  //   let numMoves = Okiya.ai.enumerate(G, ctx).length;

  //   if (numMoves === 0) {
  //     return {
  //       winner: ctx.currentPlayer,
  //       stalemate: true,
  //     };
  //   }
  // },
};
export default Quixo;
