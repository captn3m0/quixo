import React from "react";
import { render } from "react-dom";
import { Client } from "boardgame.io/react";
import Quixo from "./App";
import Board from "./Board";

const App = Client({
  game: Quixo,
  board: Board
});

render(<App />, document.getElementById("root"));
