// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import React, {FC} from 'react';
import {useLocalStorageState} from '../utils';

type Square = 'X' | 'O';
type NullableSquare = Square | null;

type BoardProps = {
  squares: NullableSquare[];
  onClick: (index: number) => void;
};

const Board: FC<BoardProps> = ({squares, onClick}) => {
  function renderSquare(i: number) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    );
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
};

const initialSquares: null[] = Array(9).fill(null);

function Game() {
  const [history, setHistory] = useLocalStorageState<NullableSquare[][]>(
    'tic-tac-toe#history',
    [initialSquares],
  );
  const [currentStep, setCurrentStep] = useLocalStorageState(
    'tic-tac-toe#step',
    0,
  );

  const currentSquares = history[currentStep];
  const nextValue = calculateNextValue(currentSquares); // ('X' or 'O')
  const winner = calculateWinner(currentSquares); // ('X', 'O', or null)
  const status = calculateStatus(winner, currentSquares, nextValue); // (`Winner: ${winner}`, `Scratch: Cat's game`, or `Next player: ${nextValue}`)

  function selectSquare(index: number) {
    if (winner || currentSquares[index]) {
      return true;
    }
    const newSquares = currentSquares.slice();
    newSquares[index] = nextValue;
    setHistory([...history.slice(0, currentStep + 1), newSquares]);
    setCurrentStep(currentStep + 1);
  }

  function restart() {
    setHistory([initialSquares]);
    setCurrentStep(0);
  }

  const moves = history.map((_squares, step) => {
    const current = step === currentStep;
    return (
      <li key={step}>
        <button disabled={current} onClick={() => setCurrentStep(step)}>
          {step === 0 ? `Go to game start` : `Go to move #${step}`}
          {current && ' (current)'}
        </button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={currentSquares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

// 計算遊戲狀態字串
function calculateStatus(
  winner: NullableSquare,
  squares: NullableSquare[],
  nextValue: Square,
): string {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean) // squares 都有值, 代表平手
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`;
}

// 如果 "X", "O" 數量相同, 就 "X", 否則為 "O" (必定 "X" 比較多)
function calculateNextValue(squares: NullableSquare[]): Square {
  const xSquaresCount = squares.filter(r => r === 'X').length;
  const oSquaresCount = squares.filter(r => r === 'O').length;
  return oSquaresCount === xSquaresCount ? 'X' : 'O';
}

// 測試所有贏的位置可能, 每個 subarray 如果有值且相同, 代表該值贏了
function calculateWinner(squares: NullableSquare[]): NullableSquare {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function App() {
  return <Game />;
}

export default App;
